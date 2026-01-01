export const translations = {
  en: {
    // Header
    siteTitle: 'Art Styles Gallery',
    searchPlaceholder: 'Search artists...',
    
    // Tabs
    artists: 'Artists',
    all: 'All',
    az: 'A-Z',
    random: 'Random',
    
    // Modal
    nameCopied: 'Artist name copied to clipboard',
    promptCopied: 'Prompt copied',
    clickToCopy: 'Click to copy',
    shareTitle: '{name} - Art Styles Gallery',
    shareText: 'Check out {name}\'s art style on Art Styles Gallery',
    examplePrompts: 'Example Prompts',
    examplePrompt1En: 'a portrait of a character in a scenic environment by {name}',
    examplePrompt1Zh: '{name} 风格的户外场景的肖像画',
    examplePrompt2En: 'a building in a stunning landscape by {name}',
    examplePrompt2Zh: '{name} 风格的、位于绝美风景中的建筑物',
    share: 'Share',
    
    // Empty states
    noResults: 'No matching artists found',
    
    // Loading & Errors
    loading: 'Loading...',
    errorLoading: 'Error loading: ',
  },
  zh: {
    // Header
    siteTitle: '艺术风格画廊',
    searchPlaceholder: '搜索艺术家...',
    
    // Tabs
    artists: '艺术家',
    all: '全部',
    az: 'A-Z',
    random: '随机',
    
    // Modal
    nameCopied: '艺术家名称已复制到剪贴板',
    promptCopied: '提示词已复制',
    clickToCopy: '点击复制',
    shareTitle: '{name} - 艺术风格画廊',
    shareText: '在艺术风格画廊查看 {name} 的风格',
    examplePrompts: '示例提示词',
    examplePrompt1En: 'a portrait of a character in a scenic environment by {name}',
    examplePrompt1Zh: '{name} 风格的户外场景的肖像画',
    examplePrompt2En: 'a building in a stunning landscape by {name}',
    examplePrompt2Zh: '{name} 风格的、位于绝美风景中的建筑物',
    share: '分享',
    
    // Empty states
    noResults: '未找到匹配的艺术家',
    
    // Loading & Errors
    loading: '加载中...',
    errorLoading: '加载错误: ',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
