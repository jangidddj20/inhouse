import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { generatePosterContent } from '../../../services/geminiService';

const VisualAssetsTab = () => {
  const [language, setLanguage] = useState('english');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [error, setError] = useState(null);

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi (हिंदी)' }
  ];

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please enter an event description');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generatePosterContent(description, language);
      
      if (result.success) {
        setGeneratedContent(result.data.posterContent);
      } else {
        setError('Failed to generate poster content. Please try again.');
      }
    } catch (error) {
      console.error('Poster generation failed:', error);
      setError('Failed to generate poster content. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert('Poster content copied to clipboard!');
    }
  };

  const handleEdit = (e) => {
    setGeneratedContent(e.target.value);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Poster Content</title>');
    printWindow.document.write('<style>body{font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;} pre{white-space: pre-wrap; word-wrap: break-word;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<pre>' + generatedContent + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Image" size={20} className="mr-2 text-primary" />
          AI Poster Content Generator
        </h3>
        
        <div className="space-y-4">
          {/* Language Selection */}
          <Select
            label="Language"
            options={languageOptions}
            value={language}
            onChange={setLanguage}
          />

          {/* Event Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Event Description <span className="text-error">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your event for poster creation...\n\nFor example:\n- Event name and theme\n- Date, time, and venue\n- Main attractions\n- Target audience\n- Visual style preferences\n- Key message to convey\n\nSupports English and Hindi!"
              className="w-full h-48 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              data-testid="poster-description-input"
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
            data-testid="generate-poster-btn"
          >
            {isGenerating ? 'Generating Poster Content...' : 'Generate Poster Content'}
          </Button>
        </div>
      </div>

      {/* Generated Poster Content */}
      {generatedContent && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="CheckCircle2" size={20} className="mr-2 text-success" />
              Generated Poster Content
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                iconName="Copy"
                iconPosition="left"
                data-testid="copy-poster-btn"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                iconName="RefreshCw"
                iconPosition="left"
                data-testid="regenerate-poster-btn"
              >
                Regenerate
              </Button>
            </div>
          </div>

          {/* Editable Poster Preview */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 border-2 border-primary/20">
              <div className="bg-white rounded-lg shadow-2xl p-8">
                <textarea
                  value={generatedContent}
                  onChange={handleEdit}
                  className="w-full h-96 px-4 py-3 bg-transparent border-2 border-dashed border-border rounded-lg text-foreground leading-relaxed resize-y focus:outline-none focus:border-primary"
                  style={{ fontFamily: 'system-ui' }}
                  data-testid="poster-preview-textarea"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
              <div className="text-xs text-muted-foreground flex items-start">
                <Icon name="Info" size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                <span>
                  This is the content for your poster. You can edit it above, then use it with your favorite design tool (Canva, Photoshop, etc.) or print it directly.
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <Button
              onClick={handleCopyContent}
              iconName="Copy"
              iconPosition="left"
              data-testid="copy-poster-final-btn"
            >
              Copy Content
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Download as text file
                const blob = new Blob([generatedContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'poster-content.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              iconName="Printer"
              iconPosition="left"
            >
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Open Canva (you can customize this)
                window.open('https://www.canva.com/create/posters/', '_blank');
              }}
              iconName="ExternalLink"
              iconPosition="left"
            >
              Open Canva
            </Button>
          </div>
        </div>
      )}

      {/* Design Tips */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Poster Design Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm">Content Placement</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Use large, bold text for main headline</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Keep key information above the fold</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Use contrasting colors for readability</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm">Visual Hierarchy</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Title → Date/Time → Location → Details</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Include clear call-to-action</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Leave white space for breathing room</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Tools */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recommended Design Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <a
            href="https://www.canva.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
          >
            <Icon name="Palette" size={20} className="text-primary" />
            <div>
              <div className="font-medium text-sm text-foreground">Canva</div>
              <div className="text-xs text-muted-foreground">Easy drag-and-drop</div>
            </div>
          </a>
          <a
            href="https://www.adobe.com/products/photoshop.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
          >
            <Icon name="Image" size={20} className="text-primary" />
            <div>
              <div className="font-medium text-sm text-foreground">Photoshop</div>
              <div className="text-xs text-muted-foreground">Professional editing</div>
            </div>
          </a>
          <a
            href="https://www.figma.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
          >
            <Icon name="Layout" size={20} className="text-primary" />
            <div>
              <div className="font-medium text-sm text-foreground">Figma</div>
              <div className="text-xs text-muted-foreground">Collaborative design</div>
            </div>
          </a>
        </div>
      </div>

      {/* Empty State */}
      {!generatedContent && !isGenerating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Image" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Create Professional Poster Content</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Describe your event and let AI generate compelling poster content with headlines, details, and design suggestions!
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Icon name="Sparkles" size={14} className="mr-1 text-primary" />
              AI-Powered
            </div>
            <div className="flex items-center">
              <Icon name="Globe" size={14} className="mr-1 text-primary" />
              Multi-language
            </div>
            <div className="flex items-center">
              <Icon name="Palette" size={14} className="mr-1 text-primary" />
              Design Ready
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualAssetsTab;