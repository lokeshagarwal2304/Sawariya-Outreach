import React, { useState } from 'react';
import { ImageGenerationConfig, AspectRatio, ImageSize } from '../types';
import { generateImage } from '../services/geminiService';
import { Loader2, Download, Image as ImageIcon, Wand2, Sparkles, AlertCircle } from 'lucide-react';

const ASPECT_RATIOS: AspectRatio[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];
const IMAGE_SIZES: ImageSize[] = ["1K", "2K", "4K"];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateImage({
        prompt,
        aspectRatio,
        imageSize
      });
      if (result) {
        setGeneratedImage(result);
      } else {
        setError("No image data returned. Please try again.");
      }
    } catch (err) {
      setError("Failed to generate image. Ensure you are using a paid API Key (required for gemini-3-pro-image-preview).");
    } finally {
      setLoading(false);
    }
  };

  const hasKey = !!process.env.API_KEY;

  return (
    <div className="max-w-4xl mx-auto p-6">
       <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 inline-flex items-center gap-2">
          <Sparkles className="text-purple-400" />
          Nano Banana Pro Studio
        </h2>
        <p className="text-gray-400 mt-2">Generate high-fidelity assets using gemini-3-pro-image-preview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="md:col-span-5 space-y-6 bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prompt</label>
              <textarea 
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[120px]"
                placeholder="A futuristic city with neon lights..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                >
                  {ASPECT_RATIOS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                  value={imageSize}
                  onChange={(e) => setImageSize(e.target.value as ImageSize)}
                >
                  {IMAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {!hasKey && (
               <div className="flex items-start gap-2 text-yellow-500 bg-yellow-900/20 p-3 rounded-lg text-sm">
                 <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                 <p>API Key not detected. Image generation requires a configured environment key.</p>
               </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt || !hasKey}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                loading || !prompt || !hasKey
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-900/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Wand2 size={18} /> Generate Asset
                </>
              )}
            </button>
        </div>

        {/* Preview Area */}
        <div className="md:col-span-7 bg-gray-900 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
          {generatedImage ? (
            <>
              <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                <a 
                  href={generatedImage} 
                  download={`sawariya-gen-${Date.now()}.png`}
                  className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200"
                >
                  <Download size={18} /> Download
                </a>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">
               {error ? (
                  <div className="text-red-400 px-6">
                    <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
                    <p>{error}</p>
                  </div>
               ) : (
                 <>
                    <ImageIcon size={64} className="mx-auto mb-4 opacity-20" />
                    <p>Enter a prompt and configure settings<br/>to generate high-quality visuals.</p>
                 </>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};