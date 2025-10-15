import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { generateEventPlan } from '../../../services/geminiService';

const EventPlanTab = () => {
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
      const result = await generateEventPlan(description, language);
      
      if (result.success) {
        setGeneratedContent(result.data.eventPlan);
      } else {
        setError('Failed to generate event plan. Please try again.');
      }
    } catch (error) {
      console.error('Event plan generation failed:', error);
      setError('Failed to generate event plan. Please check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert('Event plan copied to clipboard!');
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
          <Icon name="Calendar" size={20} className="mr-2 text-primary" />
          AI Event Plan Generator
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
              placeholder="Describe your event in detail...

For example:
- Type of event (conference, wedding, corporate party, etc.)
- Expected number of attendees
- Budget range
- Venue preferences
- Date and duration
- Special requirements or themes
- Target audience
- Goals and objectives

The more details you provide, the better the plan!
You can write in English or Hindi!"
              className="w-full h-64 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
              data-testid="eventplan-description-input"
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
            data-testid="generate-eventplan-btn"
          >
            {isGenerating ? 'Generating Event Plan...' : 'Generate Event Plan'}
          </Button>
        </div>
      </div>

      {/* Generated Event Plan */}
      {generatedContent && (
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="CheckCircle2" size={20} className="mr-2 text-success" />
              Generated Event Plan
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyContent}
                iconName="Copy"
                iconPosition="left"
                data-testid="copy-eventplan-btn"
              >
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                iconName="RefreshCw"
                iconPosition="left"
                data-testid="regenerate-eventplan-btn"
              >
                Regenerate
              </Button>
            </div>
          </div>

          {/* Editable Event Plan Preview */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-1 border border-border/50">
              <div className="text-xs text-muted-foreground px-3 py-2 flex items-center">
                <Icon name="Info" size={14} className="mr-1" />
                You can edit the event plan below to customize it further
              </div>
            </div>

            <textarea
              value={generatedContent}
              onChange={handleEdit}
              className="w-full h-[600px] px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground leading-relaxed resize-y font-mono"
              data-testid="eventplan-preview-textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            <Button
              onClick={handleCopyContent}
              iconName="Copy"
              iconPosition="left"
              data-testid="copy-eventplan-final-btn"
            >
              Copy to Clipboard
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Download as text file
                const blob = new Blob([generatedContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'event-plan.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}
              iconName="Download"
              iconPosition="left"
            >
              Download as TXT
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // Download as markdown
                const blob = new Blob([generatedContent], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'event-plan.md';
                a.click();
                URL.revokeObjectURL(url);
              }}
              iconName="FileText"
              iconPosition="left"
            >
              Download as MD
            </Button>
          </div>
        </div>
      )}

      {/* Planning Tips */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Event Planning Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center">
              <Icon name="Clock" size={16} className="mr-2 text-primary" />
              Timeline Planning
            </h4>
            <div className="space-y-2 text-sm pl-6">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Start planning 3-6 months in advance</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Create detailed week-by-week milestones</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Build in buffer time for contingencies</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center">
              <Icon name="Users" size={16} className="mr-2 text-primary" />
              Team Coordination
            </h4>
            <div className="space-y-2 text-sm pl-6">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Assign clear roles and responsibilities</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Schedule regular check-in meetings</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Use collaboration tools for updates</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center">
              <Icon name="DollarSign" size={16} className="mr-2 text-primary" />
              Budget Management
            </h4>
            <div className="space-y-2 text-sm pl-6">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Allocate 10-15% for contingencies</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Track all expenses in real-time</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Get multiple quotes for major items</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-foreground text-sm flex items-center">
              <Icon name="CheckSquare" size={16} className="mr-2 text-primary" />
              Execution Checklist
            </h4>
            <div className="space-y-2 text-sm pl-6">
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Create day-of timeline with backups</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Prepare emergency contact list</span>
              </div>
              <div className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5" />
                <span className="text-foreground">Do final walk-through 24 hours before</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!generatedContent && !isGenerating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Create Comprehensive Event Plans</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Describe your event and let AI generate a detailed, actionable event plan with timelines, budgets, and resource requirements!
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
              <Icon name="FileText" size={14} className="mr-1 text-primary" />
              Downloadable
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPlanTab;
