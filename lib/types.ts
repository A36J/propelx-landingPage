export type MarketingChannel = "META" | "GOOGLE";
export type EffortLevel = "low" | "medium" | "high";
export type MarketingHypothesis = {
  id: string;
  hypothesis: string;
  hypothesisAlias: string;
  rationale: string;
  channels: MarketingChannel[];
  targetAudience: {
    description: string;
    alias: string;
  };
  estimatedImpact: {
    confidence: number;
    effort: EffortLevel;
  };
  selected: boolean;
};

type DailyMetrics = {
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
};

// Editor details


export type EditorCanvasTypes =
  | 'hypothesisNode'
  | 'targetAudienceNode'
  | 'marketingChannelNode'

export type EditorCanvasCardType = {
  title: string
  description: string
  completed: boolean
  current: boolean
  metadata: any
  type: EditorCanvasTypes
}

export type EditorNodeType = {
  id: string
  type: EditorCanvasCardType['type']
  position: {
    x: number
    y: number
  }
  data: EditorCanvasCardType
}

export type EditorNode = EditorNodeType

export type EditorActions =
  | {
    type: 'LOAD_DATA'
    payload: {
      elements: EditorNode[]
      edges: {
        id: string
        source: string
        target: string
      }[]
    }
  }
  | {
    type: 'UPDATE_NODE'
    payload: {
      elements: EditorNode[]
    }
  }
  | { type: 'REDO' }
  | { type: 'UNDO' }
  | {
    type: 'SELECTED_ELEMENT'
    payload: {
      element: EditorNode
    }
  }

  export const connections = [
    {
      id: 'google-ads',
      title: 'Google Ads',
      logo: '/gads.png',
    },
    {
      id: 'meta-ads',
      title: 'Meta Ads',
      logo: '/meta.png',
    },
    {
      id: 'shopify',
      title: 'Shopify',
      logo: '/shopify.png',
    },
  ];

  export type WorkflowConfig = {
    workflowGraph: { [nodeId: string]: any };
    uiComponentRegistry: { [key: string]: React.ComponentType<any> };
  };