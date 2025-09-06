import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Image, Upload, Users, Smile, Cloud, Star, Heart, Flame } from "lucide-react";
import { toast } from "@/hooks/use-toast";
interface AddImageComponentProps {
  onImageSelect: (src: string, type: 'upload' | 'emoji' | 'sticker' | 'asset') => void;
  onTemplateSelect?: (src: string) => void;
}
const AddImageComponent = ({
  onImageSelect,
  onTemplateSelect
}: AddImageComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isTemplate: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("File selected:", file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        console.log("File read successfully");
        if (isTemplate && onTemplateSelect) {
          onTemplateSelect(event.target.result as string);
          toast({
            title: "Template uploaded!",
            description: "Your image has been set as the new meme template."
          });
        } else {
          onImageSelect(event.target.result as string, 'upload');
          toast({
            title: "Upload successful!",
            description: "Your image has been added to the meme editor."
          });
        }
        setIsOpen(false);
      }
      setIsUploading(false);
      // Reset the input value
      e.target.value = '';
    };
    reader.onerror = () => {
      console.error('FileReader error');
      toast({
        title: "Upload failed",
        description: "Error reading the image file. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };
  const handleEmojiSelect = (emoji: string) => {
    // Convert emoji to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
    if (ctx) {
      ctx.font = '80px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 50, 50);
      const dataURL = canvas.toDataURL();
      onImageSelect(dataURL, 'emoji');
      setIsOpen(false);
    }
  };
  const handleStickerSelect = (sticker: string) => {
    // Convert sticker to image for use in meme
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 120;
    if (ctx) {
      ctx.font = '100px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker, 60, 60);
      const dataURL = canvas.toDataURL();
      onImageSelect(dataURL, 'sticker');
      setIsOpen(false);
    }
  };
  const emojiCategories = [{
    name: 'Human',
    icon: Users,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
  }, {
    name: 'Animals',
    icon: Heart,
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🪲', '🪳', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦣', '🦏', '🦛', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫']
  }, {
    name: 'Reactions',
    icon: Smile,
    emojis: ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤝', '👐', '🤲', '🤜', '🤛', '✊', '👊', '🫳', '🫴', '👂', '🦻', '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸']
  }, {
    name: 'Planets & Space',
    icon: Star,
    emojis: ['🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛴', '🚲', '🛺', '🚁', '🚟', '🚠', '🚡', '🛩️', '✈️', '🛫', '🛬', '🪂', '💺', '🛰️', '🚀', '🛸', '🚁', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚨', '🚥', '🚦', '🛑', '🚏', '🌟', '⭐', '💫', '✨', '☄️', '🌠', '🌌', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌊', '💧', '💦', '☔']
  }, {
    name: 'Fire & Elements',
    icon: Flame,
    emojis: ['🔥', '💥', '💫', '💢', '💯', '💨', '🌪️', '🌊', '💧', '💦', '☔', '⛈️', '🌩️', '⚡', '🔆', '🔅', '💡', '🔦', '🕯️', '🪔', '🔥', '💥', '💫', '⭐', '🌟', '💫', '✨', '🌠', '☄️', '🌌', '🌈', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '❄️', '☃️', '⛄', '🌬️', '🌪️', '🌊', '💧', '💦', '☔', '⛈️', '🌩️', '⚡']
  }, {
    name: 'Clouds & Weather',
    icon: Cloud,
    emojis: ['☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '☔', '💧', '💦', '🌊']
  }, {
    name: 'Symbols & Objects',
    icon: Star,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️', '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '⚪', '⚫', '🔴', '🔵', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾', '◽', '◼️', '◻️', '⬛', '⬜', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
  }];
  const stickmanPoses = ['🚶', '🏃', '🧍', '🤸', '🤾', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🤺', '🏇', '⛷️', '🏂', '🤸', '🤼', '🤽', '🧘', '🛀', '🛌', '🕴️', '💃', '🕺', '👯', '🧖', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '🦸', '🦹', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰', '🤵', '👸', '🤴', '🥷', '🤱', '🤰', '🙇', '💁', '🙅', '🙆', '🙋', '🤦', '🤷', '🙎', '🙍', '💇', '💆', '🧏', '🤷', '🤦', '🙋', '🙅', '🙆', '💁', '🙇', '🤰', '🤱', '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '👨‍🦱', '👩‍🦰', '👨‍🦰', '👱', '👩‍🦳', '👨‍🦳', '👩‍🦲', '👨‍🦲', '🧔', '🧓', '👴', '👵', '🙈', '🙉', '🙊', '💥', '💫', '💦', '💨', '🕳️', '💣', '💤'];
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:from-pink-600 hover:to-purple-600 text-xs px-2 h-8">
          <Image className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Image</span>
          
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-pink-500" />
            Add Images, Emojis & Stickers
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="emojis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emojis">Emojis</TabsTrigger>
            <TabsTrigger value="stickman">Stickman</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emojis" className="space-y-4 max-h-96 overflow-y-auto">
            {emojiCategories.map(category => <div key={category.name}>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </h4>
                <div className="grid grid-cols-8 gap-2">
                  {category.emojis.map(emoji => <button key={emoji} onClick={() => handleEmojiSelect(emoji)} className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      {emoji}
                    </button>)}
                </div>
              </div>)}
          </TabsContent>
          
          <TabsContent value="stickman" className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Human Stickman Poses</h4>
              <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto">
                {stickmanPoses.map(pose => <button key={pose} onClick={() => handleStickerSelect(pose)} className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {pose}
                  </button>)}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stickers" className="space-y-4">
            <div className="space-y-6">
              <div className="text-center py-6">
                <Badge className="bg-pink-500 text-white mb-4">Create Custom Stickers</Badge>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Sticker Creator</h3>
                <p className="text-gray-600 mb-4">Upload your own images to create custom stickers for your memes</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Upload Your Object</h4>
                  <p className="text-gray-600 mb-4">Upload any image to use as a sticker object</p>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false)} className="hidden" id="sticker-upload" disabled={isUploading} />
                  <label htmlFor="sticker-upload">
                    <Button className="cursor-pointer bg-pink-600 hover:bg-pink-700" disabled={isUploading} asChild>
                      <span>
                        {isUploading ? "Uploading..." : "Choose File"}
                      </span>
                    </Button>
                  </label>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Badge variant="secondary">PNG, JPG supported</Badge>
                  <Badge variant="secondary">Max 10MB</Badge>
                  <Badge variant="secondary">Auto-resize to sticker</Badge>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Quick Stickman Selection</h4>
                <div className="grid grid-cols-6 gap-3">
                  {stickmanPoses.slice(0, 12).map(pose => <button key={pose} onClick={() => handleStickerSelect(pose)} className="text-3xl p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                      {pose}
                    </button>)}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <Tabs defaultValue="element" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="element" className="mx-[143px]">  Add Image Element</TabsTrigger>
                
              </TabsList>
              
              <TabsContent value="element" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Add Image Element</h3>
                  <p className="text-gray-600 mb-4">Upload an image to use as a draggable element in your meme</p>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false)} className="hidden" id="element-upload-input" disabled={isUploading} />
                  <label htmlFor="element-upload-input">
                    <Button className="cursor-pointer bg-pink-600 hover:bg-pink-700" disabled={isUploading} asChild>
                      <span>
                        {isUploading ? "Uploading..." : "Choose Image"}
                      </span>
                    </Button>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="secondary">JPG, PNG supported</Badge>
                  <Badge variant="secondary">Max 10MB</Badge>
                  <Badge variant="secondary">Drag, rotate & scale</Badge>
                </div>
              </TabsContent>
              
              <TabsContent value="template" className="space-y-4">
                <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Replace Meme Template</h3>
                  <p className="text-gray-600 mb-4">Upload a new image to replace the current meme template</p>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="hidden" id="template-upload-input" disabled={isUploading} />
                  <label htmlFor="template-upload-input">
                    <Button className="cursor-pointer bg-orange-600 hover:bg-orange-700" disabled={isUploading} asChild>
                      <span>
                        {isUploading ? "Uploading..." : "Choose Template"}
                      </span>
                    </Button>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Badge variant="secondary">JPG, PNG supported</Badge>
                  <Badge variant="secondary">Max 10MB</Badge>
                  
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>;
};
export default AddImageComponent;