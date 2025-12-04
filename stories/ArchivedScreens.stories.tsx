import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ToastProvider } from '../components/ui/Toast';
import { ContextDashboard } from '../archived/screens/ContextDashboard';
import { ContextDetail } from '../archived/screens/ContextDetail';
import { DocGenV2 } from '../archived/screens/DocGenV2';
import { DocGenV3 } from '../archived/screens/DocGenV3';
import { DocumentGenerator } from '../archived/screens/DocumentGenerator';
import { JourneyBoard } from '../archived/screens/JourneyBoard';
import { KnowledgeChat } from '../archived/screens/KnowledgeChat';
import { OntologyViewer } from '../archived/screens/OntologyViewer';
import { RichExperience } from '../archived/screens/RichExperience';
import { Team } from '../archived/screens/Team';
import { WizardPage } from '../archived/screens/WizardPage';
import { WorkspaceExplorer } from '../archived/screens/WorkspaceExplorer';

const meta: Meta = {
  title: 'Archived/Screens',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="min-h-screen bg-white">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj;

export const ContextDashboardStory: Story = {
  name: 'ContextDashboard',
  render: () => <ContextDashboard />,
};

export const ContextDetailStory: Story = {
  name: 'ContextDetail',
  render: () => <ContextDetail />,
};

export const DocGenV2Story: Story = {
  name: 'DocGenV2',
  render: () => <DocGenV2 />,
};

export const DocGenV3Story: Story = {
  name: 'DocGenV3',
  render: () => <DocGenV3 />,
};

export const DocumentGeneratorStory: Story = {
  name: 'DocumentGenerator',
  render: () => <DocumentGenerator />,
};

export const JourneyBoardStory: Story = {
  name: 'JourneyBoard',
  render: () => <JourneyBoard />,
};

export const KnowledgeChatStory: Story = {
  name: 'KnowledgeChat',
  render: () => <KnowledgeChat />,
};

export const OntologyViewerStory: Story = {
  name: 'OntologyViewer',
  render: () => <OntologyViewer />,
};

export const RichExperienceStory: Story = {
  name: 'RichExperience',
  render: () => <RichExperience />,
};

export const TeamStory: Story = {
  name: 'Team',
  render: () => <Team />,
};

export const WizardPageStory: Story = {
  name: 'WizardPage',
  render: () => <WizardPage />,
};

export const WorkspaceExplorerStory: Story = {
  name: 'WorkspaceExplorer',
  render: () => <WorkspaceExplorer />,
};
