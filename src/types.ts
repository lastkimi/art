export interface Style {
  id: number;
  name: string;
  tags: string[];
  imageUrl: string;
  proxyImageUrl: string;
  imageUrl2?: string;
  proxyImageUrl2?: string;
}

export interface StylesData {
  styles: Style[];
  total: number;
}
