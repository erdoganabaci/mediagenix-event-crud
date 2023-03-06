interface EventPlan extends BaseEventPlan {
    id: string;
  };
  interface BaseEventPlan {
    title: string;
    type: "generic" | "holiday";
    description?: string;
    startDate: string;
    endDate: string;
    startDateendDate?: string;
  }

export type { EventPlan,BaseEventPlan}