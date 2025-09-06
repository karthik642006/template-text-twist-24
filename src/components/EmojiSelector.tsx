import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Smile } from "lucide-react";
interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void;
}
const EmojiSelector = ({
  onEmojiSelect
}: EmojiSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const emojis = ["😀", "😂", "🤣", "😊", "😍", "🤔", "😎", "🤪", "😈", "👿", "💀", "👻", "🤡", "💩", "🔥", "💯", "👌", "👍", "👎", "🤘", "🖕", "💪", "🧠", "👀", "👑", "💎", "🚀", "💰", "🎯", "⚡"];
  const thugLifeSymbols = ["🕶️", "🚬", "💰", "👑", "🔫", "💎", "🏆", "⚡", "🔥", "💯", "🎯", "🚀", "💪", "🤘", "😎", "🤴", "👊", "🖤", "⭐", "💫"];
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };
  return <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>Select Emoji or Symbol</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Emojis</h4>
            <div className="grid grid-cols-10 gap-2">
              {emojis.map((emoji, index) => <Button key={index} variant="ghost" className="p-2 h-8 w-8 text-lg hover:bg-gray-100" onClick={() => handleEmojiClick(emoji)}>
                  {emoji}
                </Button>)}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-gray-700">Thug Life Symbols</h4>
            <div className="grid grid-cols-10 gap-2">
              {thugLifeSymbols.map((symbol, index) => <Button key={index} variant="ghost" className="p-2 h-8 w-8 text-lg hover:bg-gray-100" onClick={() => handleEmojiClick(symbol)}>
                  {symbol}
                </Button>)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default EmojiSelector;