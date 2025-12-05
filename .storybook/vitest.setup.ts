import { setProjectAnnotations } from '@storybook/nextjs-vite';
import { beforeAll } from 'vitest';
import * as projectAnnotations from './preview';

const annotations = setProjectAnnotations([projectAnnotations]);

beforeAll(annotations.beforeAll);
