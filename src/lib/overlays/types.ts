export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  action?: (item: MenuItem) => void;
}
