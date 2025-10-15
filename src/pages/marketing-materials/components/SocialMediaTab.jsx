import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { generateInstagramCaption } from '../../../services/geminiService';

const SocialMediaTab = () => {
  const [language, setLanguage] = useState('english');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('engaging');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिंदी)' }
  ];

  const styleOptions = [
    { value: 'engaging', label: 'Engaging & Fun' },
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'promotional', label: 'Promotional' }
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter an event description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateInstagramCaption(description, language, style);
      
      if (result.success) {
        setGeneratedContent(result.data.instagramCaption);
      } else {
        setError('Failed to generate caption. Please try again.');
      }
    } catch (error) {
      console.error('Caption generation failed:', error);
      setError('Failed to generate caption. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert('Instagram caption copied to clipboard!');
    }
  };

  const handleEdit = (e) => {
    setGeneratedContent(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Instagram" size={20} className="mr-2 text-pink-600" />
          AI Instagram Caption Generator
        </h3>
        
        <div className="space-y-4">
          {/* Language and Style Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Language"
              options={languageOptions}
              value={language}
              onChange={setLanguage}
            />
            <Select
              label="Caption Style"
              options={styleOptions}
              value={style}
              onChange={setStyle}
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Description <span className="text-error">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event for Instagram...\n\nFor example:\n- Event name and theme\n- Key highlights\n- Date and location\n- Who should attend\n- Special features or activities\n\nSupports English and Hindi!"
              className="w-full h-40 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              data-testid="instagram-description-input"
            />
            {error && (
              <p className="text-sm text-error mt-1">{error}</p>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            iconName="Sparkles"
            iconPosition="left"
            className="w-full md:w-auto"
            disabled={!description.trim()}
            data-testid="generate-caption-btn"
          >
            {isGenerating ? 'Generating Caption...' : 'Generate Instagram Caption'}
          </Button>
        </div>
      </div>

      {/* Generated Caption */}
      {generatedContent && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="CheckCircle2" size={20} className="mr-2 text-success" />
              Generated Caption
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                iconName="Copy"
                iconPosition="left"
                data-testid="copy-caption-btn"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                iconName="RefreshCw"
                iconPosition="left"
                data-testid="regenerate-caption-btn"
              >
                Regenerate
              </Button>
            </div>
          </div>

          {/* Editable Caption Preview */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-1 border border-border/50">
              <div className="text-xs text-muted-foreground px-3 py-2 flex items-center">
                <Icon name="Info" size={14} className="mr-1" />
                You can edit the caption below before copying to Instagram
              </div>
            </div>

            <textarea
              value={generatedContent}
              onChange={handleEdit}
              className="w-full h-80 px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground leading-relaxed resize-y"
              data-testid="caption-preview-textarea"
            />

            {/* Character Count */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Characters: {generatedContent.length} / 2200</span>
              {generatedContent.length > 2200 && (
                <span className="text-error flex items-center">
                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                  Exceeds Instagram limit
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              onClick={handleCopyContent}
              iconName="Copy"
              iconPosition="left"
              data-testid="copy-caption-final-btn"
            >
              Copy to Clipboard
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Share to Instagram (opens Instagram if on mobile)
                const text = encodeURIComponent(generatedContent);
                window.open(`https://www.instagram.com/`, '_blank');
              }}
              iconName="Instagram"
              iconPosition="left"
            >
              Open Instagram
            </Button>
          </div>
        </div>
      )}

      {/* Platform Tips */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Instagram Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Use emojis to increase engagement</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Include 15-20 relevant hashtags</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Add a clear call-to-action</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Keep captions under 2200 characters</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Tag relevant accounts and locations</span>
            </div>
            <div className="flex items-start space-x-2">
              <Icon name="Check" size={16} className="text-success mt-0.5" />
              <span className="text-foreground">Post at optimal engagement times</span>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!generatedContent && !isGenerating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Instagram" size={24} className="text-pink-600" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Create Engaging Instagram Captions</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Describe your event and let AI create engaging Instagram captions with emojis and hashtags!
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Icon name="Sparkles" size={14} className="mr-1 text-primary" />
              AI-Powered
            </div>
            <div className="flex items-center">
              <Icon name="Hash" size={14} className="mr-1 text-primary" />
              With Hashtags
            </div>
            <div className="flex items-center">
              <Icon name="Smile" size={14} className="mr-1 text-primary" />
              Emojis Included
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaTab;