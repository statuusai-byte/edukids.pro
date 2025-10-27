import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

interface AvatarUploaderProps {
  src: string | null;
  fallback: string;
  onImageSelect: (file: File) => void;
}

export const AvatarUploader = ({ src, fallback, onImageSelect }: AvatarUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative w-24 h-24 group">
      <Avatar className="w-24 h-24 border-2 border-primary/50">
        <AvatarImage src={preview ?? undefined} alt="Avatar do usuário" />
        <AvatarFallback className="text-3xl">{fallback}</AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute inset-0 w-full h-full rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        onClick={handleClick}
      >
        <Camera className="h-8 w-8" />
        <span className="sr-only">Mudar avatar</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};