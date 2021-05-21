export interface AppRoute {
  app?: string;
  route?: string;
  url: string;
  userHasAccess?: boolean;
  aliases?: string[];
}
