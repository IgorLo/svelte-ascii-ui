import type { HTMLInputAttributes } from 'svelte/elements';
import type { Size } from '../types';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Mark {
  value: number;
  label?: string;
}

export interface FieldControl {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

export interface PickerProps extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'children' | 'multiple'> {
  size?: Size;
  options: Option[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  listLabel?: string;
  emptyText?: string;
  loadingText?: string;
  retryLabel?: string;
  removeLabel?: string;
  requiredText?: string;
}
