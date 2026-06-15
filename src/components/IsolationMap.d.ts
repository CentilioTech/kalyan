// Type surface for the platform-split map. Metro resolves IsolationMap.web.tsx /
// IsolationMap.native.tsx at build time; this lets  resolve the bare import.
import type { IsolationMapProps } from "./IsolationMap.web";
export type { IsolationMapProps };
export declare function IsolationMap(props: IsolationMapProps): JSX.Element;
