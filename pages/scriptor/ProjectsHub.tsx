
import React, { useState } from 'react';
import { PageLayout } from '../../components/ui/PageLayout';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProjectSettingsModal } from '../../components/scriptor/ProjectSettingsModal';
import { Plus, Search, Settings, FileText, Database, Folder, Users } from '../../components/icons/Icons';
import { Project, Workspace } from '../../types';
import { cn } from '../../utils';

interface ProjectsHubProps {
  projects: Project[];
  availableWorkspaces: Workspace[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (project: Partial<Project>) => void;
  onUpdateProject: (id: string, updates: Partial<Project>)