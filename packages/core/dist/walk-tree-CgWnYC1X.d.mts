import { ReactElement, ReactNode, CSSProperties, ElementType, JSX } from 'react';

type ItemSelector = {
    index: number;
    zone?: string;
};

type FieldOption = {
    label: string;
    value: string | number | boolean | undefined | null | object;
};
type FieldOptions = Array<FieldOption> | ReadonlyArray<FieldOption>;
interface BaseField {
    label?: string;
    labelIcon?: ReactElement;
    metadata?: FieldMetadata;
    visible?: boolean;
}
interface TextField extends BaseField {
    type: "text";
    placeholder?: string;
    contentEditable?: boolean;
}
interface NumberField extends BaseField {
    type: "number";
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}
interface TextareaField extends BaseField {
    type: "textarea";
    placeholder?: string;
    contentEditable?: boolean;
}
interface SelectField extends BaseField {
    type: "select";
    options: FieldOptions;
}
interface RadioField extends BaseField {
    type: "radio";
    options: FieldOptions;
}
interface ArrayField<Props extends {
    [key: string]: any;
}[] = {
    [key: string]: any;
}[], UserField extends {} = {}> extends BaseField {
    type: "array";
    arrayFields: {
        [SubPropName in keyof Props[0]]: UserField extends {
            type: PropertyKey;
        } ? Field<Props[0][SubPropName], UserField> | UserField : Field<Props[0][SubPropName], UserField>;
    };
    defaultItemProps?: Props[0] | ((index: number) => Props[0]);
    getItemSummary?: (item: Props[0], index?: number) => ReactNode;
    max?: number;
    min?: number;
}
interface ObjectField<Props extends any = {
    [key: string]: any;
}, UserField extends {} = {}> extends BaseField {
    type: "object";
    objectFields: {
        [SubPropName in keyof Props]: UserField extends {
            type: PropertyKey;
        } ? Field<Props[SubPropName]> | UserField : Field<Props[SubPropName]>;
    };
}
type Adaptor<AdaptorParams = {}, TableShape extends Record<string, any> = {}, PropShape = TableShape> = {
    name: string;
    fetchList: (adaptorParams?: AdaptorParams) => Promise<TableShape[] | null>;
    mapProp?: (value: TableShape) => PropShape;
};
type NotUndefined<T> = T extends undefined ? never : T;
type ExternalFieldWithAdaptor<Props extends any = {
    [key: string]: any;
}> = BaseField & {
    type: "external";
    placeholder?: string;
    adaptor: Adaptor<any, any, Props>;
    adaptorParams?: object;
    getItemSummary: (item: NotUndefined<Props>, index?: number) => ReactNode;
};
type CacheOpts = {
    enabled?: boolean;
};
interface ExternalField<Props extends any = {
    [key: string]: any;
}> extends BaseField {
    type: "external";
    cache?: CacheOpts;
    placeholder?: string;
    fetchList: (params: {
        query: string;
        filters: Record<string, any>;
    }) => Promise<any[] | null>;
    mapProp?: (value: any) => Props;
    mapRow?: (value: any) => Record<string, string | number | ReactElement>;
    getItemSummary?: (item: NotUndefined<Props>, index?: number) => ReactNode;
    showSearch?: boolean;
    renderFooter?: (props: {
        items: any[];
    }) => ReactElement;
    initialQuery?: string;
    filterFields?: Record<string, Field>;
    initialFilters?: Record<string, any>;
}
type CustomFieldRender<Value extends any> = (props: {
    field: CustomField<Value>;
    name: string;
    id: string;
    value: Value;
    onChange: (value: Value) => void;
    readOnly?: boolean;
}) => ReactElement;
interface CustomField<Value extends any> extends BaseField {
    type: "custom";
    render: CustomFieldRender<Value>;
    contentEditable?: boolean;
    key?: string;
}
interface SlotField extends BaseField {
    type: "slot";
    allow?: string[];
    disallow?: string[];
}
type Field<ValueType = any, UserField extends {} = {}> = TextField | NumberField | TextareaField | SelectField | RadioField | ArrayField<ValueType extends {
    [key: string]: any;
}[] ? ValueType : never, UserField> | ObjectField<ValueType, UserField> | ExternalField<ValueType> | ExternalFieldWithAdaptor<ValueType> | CustomField<ValueType> | SlotField;
type Fields<ComponentProps extends DefaultComponentProps = DefaultComponentProps, UserField extends {} = {}> = {
    [PropName in keyof Omit<ComponentProps, "editMode">]: UserField extends {
        type: PropertyKey;
    } ? Field<ComponentProps[PropName], UserField> | UserField : Field<ComponentProps[PropName]>;
};
type FieldProps<F = Field<any>, ValueType = any> = {
    field: F;
    value: ValueType;
    id?: string;
    onChange: (value: ValueType, uiState?: Partial<UiState>) => void;
    readOnly?: boolean;
};

type DropZoneProps = {
    zone: string;
    allow?: string[];
    disallow?: string[];
    style?: CSSProperties;
    minEmptyHeight?: CSSProperties["minHeight"] | number;
    className?: string;
    collisionAxis?: DragAxis;
    as?: ElementType;
};

type PuckContext = {
    renderDropZone: (props: DropZoneProps) => React.ReactNode;
    metadata: Metadata;
    isEditing: boolean;
    dragRef: ((element: Element | null) => void) | null;
};
type DefaultRootFieldProps = {
    title?: string;
};
type DefaultRootRenderProps<Props extends DefaultComponentProps = DefaultRootFieldProps> = WithPuckProps<WithChildren<Props>>;
type DefaultRootProps = DefaultRootRenderProps;
type DefaultComponentProps = {
    [key: string]: any;
};

type WithId<Props> = Props & {
    id: string;
};
type WithPuckProps<Props> = Props & {
    puck: PuckContext;
    editMode?: boolean;
};
type AsFieldProps<Props> = Omit<Props, "children" | "puck" | "editMode">;
type WithChildren<Props> = Props & {
    children: ReactNode;
};
type UserGenerics<UserConfig extends Config = Config, UserParams extends ExtractConfigParams<UserConfig> = ExtractConfigParams<UserConfig>, UserData extends Data<UserParams["props"], UserParams["rootProps"]> | Data = Data<UserParams["props"], UserParams["rootProps"]>, UserAppState extends PrivateAppState<UserData> = PrivateAppState<UserData>, UserPublicAppState extends AppState<UserData> = AppState<UserData>, UserComponentData extends ComponentData = UserData["content"][0]> = {
    UserConfig: UserConfig;
    UserParams: UserParams;
    UserProps: UserParams["props"];
    UserRootProps: UserParams["rootProps"] & DefaultRootFieldProps;
    UserData: UserData;
    UserAppState: UserAppState;
    UserPublicAppState: UserPublicAppState;
    UserComponentData: UserComponentData;
    UserField: UserParams["field"];
};
type ExtractField<UserField extends {
    type: PropertyKey;
}, T extends UserField["type"]> = Extract<UserField, {
    type: T;
}>;

type SlotComponent = (props?: Omit<DropZoneProps, "zone">) => ReactNode;
type PuckComponent<Props> = (props: WithId<WithPuckProps<{
    [K in keyof Props]: WithDeepSlots<Props[K], SlotComponent>;
}>>) => JSX.Element;
type ResolveDataTrigger = "insert" | "replace" | "load" | "force";
type WithPartialProps<T, Props extends DefaultComponentProps> = Omit<T, "props"> & {
    props?: Partial<Props>;
};
interface ComponentConfigExtensions {
}
type ComponentConfigInternal<RenderProps extends DefaultComponentProps, FieldProps extends DefaultComponentProps, DataShape = Omit<ComponentData<FieldProps>, "type">, // NB this doesn't include AllProps, so types will not contain deep slot types. To fix, we require a breaking change.
UserField extends BaseField = {}> = {
    render: PuckComponent<RenderProps>;
    label?: string;
    defaultProps?: FieldProps;
    fields?: Fields<FieldProps, UserField>;
    permissions?: Partial<Permissions>;
    inline?: boolean;
    resolveFields?: (data: DataShape, params: {
        changed: Partial<Record<keyof FieldProps, boolean> & {
            id: string;
        }>;
        fields: Fields<FieldProps>;
        lastFields: Fields<FieldProps>;
        lastData: DataShape | null;
        metadata: ComponentMetadata;
        appState: AppState;
        parent: ComponentData | null;
    }) => Promise<Fields<FieldProps>> | Fields<FieldProps>;
    resolveData?: (data: DataShape, params: {
        changed: Partial<Record<keyof FieldProps, boolean> & {
            id: string;
        }>;
        lastData: DataShape | null;
        metadata: ComponentMetadata;
        trigger: ResolveDataTrigger;
    }) => Promise<WithPartialProps<DataShape, FieldProps>> | WithPartialProps<DataShape, FieldProps>;
    resolvePermissions?: (data: DataShape, params: {
        changed: Partial<Record<keyof FieldProps, boolean> & {
            id: string;
        }>;
        lastPermissions: Partial<Permissions>;
        permissions: Partial<Permissions>;
        appState: AppState;
        lastData: DataShape | null;
        parent: ComponentData | null;
    }) => Promise<Partial<Permissions>> | Partial<Permissions>;
    metadata?: ComponentMetadata;
} & ComponentConfigExtensions;
type ComponentConfig<RenderPropsOrParams extends LeftOrExactRight<RenderPropsOrParams, DefaultComponentProps, ComponentConfigParams> = DefaultComponentProps, FieldProps extends DefaultComponentProps = RenderPropsOrParams extends {
    props: any;
} ? RenderPropsOrParams["props"] : RenderPropsOrParams, DataShape = Omit<ComponentData<FieldProps>, "type">> = RenderPropsOrParams extends ComponentConfigParams<infer ParamsRenderProps, never> ? ComponentConfigInternal<ParamsRenderProps, FieldProps, DataShape, {}> : RenderPropsOrParams extends ComponentConfigParams<infer ParamsRenderProps, infer ParamsFields> ? ComponentConfigInternal<ParamsRenderProps, FieldProps, DataShape, ParamsFields[keyof ParamsFields] & BaseField> : ComponentConfigInternal<RenderPropsOrParams, FieldProps, DataShape>;
type RootConfigInternal<RootProps extends DefaultComponentProps = DefaultComponentProps, UserField extends BaseField = {}> = Partial<ComponentConfigInternal<WithChildren<RootProps>, AsFieldProps<RootProps>, RootData<AsFieldProps<RootProps>>, UserField>>;
type RootConfig<RootPropsOrParams extends LeftOrExactRight<RootPropsOrParams, DefaultComponentProps, ComponentConfigParams> = DefaultComponentProps> = RootPropsOrParams extends ComponentConfigParams<infer Props, never> ? Partial<RootConfigInternal<WithChildren<Props>, {}>> : RootPropsOrParams extends ComponentConfigParams<infer Props, infer UserFields> ? Partial<RootConfigInternal<WithChildren<Props>, UserFields[keyof UserFields] & BaseField>> : Partial<RootConfigInternal<WithChildren<RootPropsOrParams>>>;
type Category<ComponentName> = {
    components?: ComponentName[];
    title?: string;
    visible?: boolean;
    defaultExpanded?: boolean;
};
type ConfigInternal<Props extends DefaultComponents = DefaultComponents, RootProps extends DefaultComponentProps = DefaultComponentProps, CategoryName extends string = string, UserField extends {} = {}> = {
    categories?: Record<CategoryName, Category<keyof Props>> & {
        other?: Category<keyof Props>;
    };
    components: {
        [ComponentName in keyof Props]: Omit<ComponentConfigInternal<Props[ComponentName], Props[ComponentName], Omit<ComponentData<Props[ComponentName]>, "type">, UserField>, "type">;
    };
    root?: RootConfigInternal<RootProps, UserField>;
};
type DefaultComponents = Record<string, any>;
type Config<PropsOrParams extends LeftOrExactRight<PropsOrParams, DefaultComponents, ConfigParams> = DefaultComponents | ConfigParams, RootProps extends DefaultComponentProps = any, CategoryName extends string = string> = PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, never> ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number]> : PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, infer ParamFields> ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number], ParamFields[keyof ParamFields] & BaseField> : PropsOrParams extends ConfigParams<infer ParamComponents, infer ParamRoot, infer ParamCategoryName, any> ? ConfigInternal<ParamComponents, ParamRoot, ParamCategoryName[number], {}> : ConfigInternal<PropsOrParams, RootProps, CategoryName>;
type ExtractConfigParams<UserConfig extends ConfigInternal> = UserConfig extends ConfigInternal<infer PropsOrParams, infer RootProps, infer CategoryName, infer UserField> ? {
    props: PropsOrParams;
    rootProps: RootProps & DefaultRootFieldProps;
    categoryNames: CategoryName;
    field: UserField extends {
        type: string;
    } ? UserField : Field;
} : never;
type ConfigParams<Components extends DefaultComponents = DefaultComponents, RootProps extends DefaultComponentProps = any, CategoryNames extends string[] = string[], UserFields extends FieldsExtension = FieldsExtension> = {
    components?: Components;
    root?: RootProps;
    categories?: CategoryNames;
    fields?: AssertHasValue<UserFields>;
};
type ComponentConfigParams<Props extends DefaultComponentProps = DefaultComponentProps, UserFields extends FieldsExtension = never> = {
    props: Props;
    fields?: AssertHasValue<UserFields>;
};

type BaseData<Props extends {
    [key: string]: any;
} = {
    [key: string]: any;
}> = {
    readOnly?: Partial<Record<keyof Props, boolean>>;
};
type RootDataWithProps<Props extends DefaultComponentProps = DefaultRootFieldProps> = BaseData<Props> & {
    props: Props;
};
type RootDataWithoutProps<Props extends DefaultComponentProps = DefaultRootFieldProps> = Props;
type RootData<Props extends DefaultComponentProps = DefaultRootFieldProps> = Partial<RootDataWithProps<AsFieldProps<Props>>> & Partial<RootDataWithoutProps<Props>>;
type ComponentData<Props extends DefaultComponentProps = DefaultComponentProps, Name = string, Components extends Record<string, DefaultComponentProps> = Record<string, DefaultComponentProps>> = {
    type: Name;
    props: WithDeepSlots<WithId<Props>, Content<Components>>;
} & BaseData<Props>;
type ComponentDataOptionalId<Props extends DefaultComponentProps = DefaultComponentProps, Name = string> = {
    type: Name;
    props: Props & {
        id?: string;
    };
} & BaseData<Props>;
type MappedItem = ComponentData;
type ComponentDataMap<Components extends DefaultComponents = DefaultComponents> = {
    [K in keyof Components]: ComponentData<Components[K], K extends string ? K : never, Components>;
}[keyof Components];
type Content<PropsMap extends {
    [key: string]: DefaultComponentProps;
} = {
    [key: string]: DefaultComponentProps;
}> = ComponentDataMap<PropsMap>[];
type Data<Components extends DefaultComponents = DefaultComponents, RootProps extends DefaultComponentProps = DefaultRootFieldProps> = {
    root: WithDeepSlots<RootData<RootProps>, Content<Components>>;
    content: Content<Components>;
    zones?: Record<string, Content<Components>>;
};
type Metadata = {
    [key: string]: any;
};
interface PuckMetadata extends Metadata {
}
interface ComponentMetadata extends PuckMetadata {
}
interface FieldMetadata extends Metadata {
}

type ItemWithId = {
    _arrayId: string;
    _originalIndex: number;
};
type ArrayState = {
    items: ItemWithId[];
    openId: string;
};
type UiState = {
    leftSideBarVisible: boolean;
    rightSideBarVisible: boolean;
    leftSideBarWidth?: number | null;
    rightSideBarWidth?: number | null;
    itemSelector: ItemSelector | null;
    arrayState: Record<string, ArrayState | undefined>;
    previewMode: "interactive" | "edit";
    componentList: Record<string, {
        components?: string[];
        title?: string;
        visible?: boolean;
        expanded?: boolean;
    }>;
    isDragging: boolean;
    viewports: {
        current: {
            width: number;
            height: number | "auto";
        };
        controlsVisible: boolean;
        options: Viewport[];
    };
    field: {
        focus?: string | null;
    };
};
type AppState<UserData extends Data = Data> = {
    data: UserData;
    ui: UiState;
};

type ZoneType = "root" | "dropzone" | "slot";
type PuckNodeData = {
    data: ComponentData;
    flatData: ComponentData;
    parentId: string | null;
    zone: string;
    path: string[];
};
type PuckZoneData = {
    contentIds: string[];
    type: ZoneType;
};
type NodeIndex = Record<string, PuckNodeData>;
type ZoneIndex = Record<string, PuckZoneData>;
type PrivateAppState<UserData extends Data = Data> = AppState<UserData> & {
    indexes: {
        nodes: NodeIndex;
        zones: ZoneIndex;
    };
};
type BuiltinTypes = Date | RegExp | Error | Function | symbol | null | undefined;
/**
 * Recursively walk T and replace Slots with SlotComponents
 */
type WithDeepSlots<T, SlotType = T> = T extends Slot ? SlotType : T extends (infer U)[] ? Array<WithDeepSlots<U, SlotType>> : T extends (infer U)[] ? WithDeepSlots<U, SlotType>[] : T extends BuiltinTypes ? T : T extends object ? {
    [K in keyof T]: WithDeepSlots<T[K], SlotType>;
} : T;
type FieldsExtension = {
    [Type in string]: {
        type: Type;
    };
};
type Exact<T, Target> = Record<Exclude<keyof T, keyof Target>, never>;
type LeftOrExactRight<Union, Left, Right> = (Left & Union extends Right ? Exact<Union, Right> : Left) | (Right & Exact<Union, Right>);
type AssertHasValue<T, True = T, False = never> = [keyof T] extends [
    never
] ? False : True;

type MapFnParams<ThisField = Field> = {
    value: any;
    parentId: string;
    propName: string;
    field: ThisField;
    propPath: string;
};

type FieldTransformFnParams<T> = Omit<MapFnParams<T>, "parentId"> & {
    isReadOnly: boolean;
    componentId: string;
};
type FieldTransformFn<T> = (params: FieldTransformFnParams<T>) => any;
type FieldTransforms<UserConfig extends Config = Config<{
    fields: {};
}>, // Setting fields: {} helps TS choose default field types
G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>, UserField extends {
    type: string;
} = Field | G["UserField"]> = Partial<{
    [Type in UserField["type"]]: FieldTransformFn<ExtractField<UserField, Type>>;
}>;

type RenderFunc<Props extends {
    [key: string]: any;
} = {
    children: ReactNode;
}> = (props: Props) => ReactElement;
declare const overrideKeys: readonly ["header", "headerActions", "fields", "fieldLabel", "drawer", "drawerItem", "componentOverlay", "outline", "puck", "preview"];
type OverrideKey = (typeof overrideKeys)[number];
type OverridesGeneric<Shape extends {
    [key in OverrideKey]: any;
}> = Shape;
type Overrides<UserConfig extends Config = Config> = OverridesGeneric<{
    fieldTypes: Partial<FieldRenderFunctions<UserConfig>>;
    header: RenderFunc<{
        actions: ReactNode;
        children: ReactNode;
    }>;
    actionBar: RenderFunc<{
        label?: string;
        children: ReactNode;
        parentAction: ReactNode;
    }>;
    headerActions: RenderFunc<{
        children: ReactNode;
    }>;
    preview: RenderFunc;
    fields: RenderFunc<{
        children: ReactNode;
        isLoading: boolean;
        itemSelector?: ItemSelector | null;
    }>;
    fieldLabel: RenderFunc<{
        children?: ReactNode;
        icon?: ReactNode;
        label: string;
        el?: "label" | "div";
        readOnly?: boolean;
        className?: string;
    }>;
    components: RenderFunc;
    componentItem: RenderFunc<{
        children: ReactNode;
        name: string;
    }>;
    drawer: RenderFunc;
    drawerItem: RenderFunc<{
        children: ReactNode;
        name: string;
    }>;
    iframe: RenderFunc<{
        children: ReactNode;
        document?: Document;
    }>;
    outline: RenderFunc;
    componentOverlay: RenderFunc<{
        children: ReactNode;
        hover: boolean;
        isSelected: boolean;
        componentId: string;
        componentType: string;
    }>;
    puck: RenderFunc;
}>;
type FieldRenderFunctions<UserConfig extends Config = Config, G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>, UserField extends {
    type: string;
} = Field | G["UserField"]> = Omit<{
    [Type in UserField["type"]]: React.FunctionComponent<FieldProps<ExtractField<UserField, Type>, any> & {
        children: ReactNode;
        name: string;
    }>;
}, "custom">;

type Direction = "left" | "right" | "up" | "down" | null;
type DragAxis = "dynamic" | "y" | "x";

type iconTypes = "Smartphone" | "Monitor" | "Tablet";
type Viewport = {
    width: number;
    height?: number | "auto";
    label?: string;
    icon?: iconTypes | ReactNode;
};
type Viewports = Viewport[];

type Permissions = {
    drag: boolean;
    duplicate: boolean;
    delete: boolean;
    edit: boolean;
    insert: boolean;
} & Record<string, boolean>;
type IframeConfig = {
    enabled?: boolean;
    waitForStyles?: boolean;
};
type OnAction<UserData extends Data = Data> = (action: PuckAction, appState: AppState<UserData>, prevAppState: AppState<UserData>) => void;
type Plugin<UserConfig extends Config = Config> = {
    overrides?: Partial<Overrides<UserConfig>>;
    fieldTransforms?: FieldTransforms<UserConfig>;
};
type History<D = any> = {
    state: D;
    id?: string;
};
type InitialHistoryAppend<AS = Partial<AppState>> = {
    histories: History<AS>[];
    index?: number;
    appendData?: true;
};
type InitialHistoryNoAppend<AS = Partial<AppState>> = {
    histories: [History<AS>, ...History<AS>[]];
    index?: number;
    appendData?: false;
};
type InitialHistory<AS = Partial<AppState>> = InitialHistoryAppend<AS> | InitialHistoryNoAppend<AS>;
type Slot<Props extends {
    [key: string]: DefaultComponentProps;
} = {
    [key: string]: DefaultComponentProps;
}> = {
    [K in keyof Props]: ComponentDataOptionalId<Props[K], K extends string ? K : never>;
}[keyof Props][];
type WithSlotProps<Target extends Record<string, any>, Components extends DefaultComponents = DefaultComponents, SlotType extends Content<Components> = Content<Components>> = WithDeepSlots<Target, SlotType>;

type InsertAction = {
    type: "insert";
    componentType: string;
    destinationIndex: number;
    destinationZone: string;
    id?: string;
};
type DuplicateAction = {
    type: "duplicate";
    sourceIndex: number;
    sourceZone: string;
};
type ReplaceAction<UserData extends Data = Data> = {
    type: "replace";
    destinationIndex: number;
    destinationZone: string;
    data: ComponentData;
    ui?: Partial<AppState<UserData>["ui"]>;
};
type ReplaceRootAction<UserData extends Data = Data> = {
    type: "replaceRoot";
    root: RootData;
    ui?: Partial<AppState<UserData>["ui"]>;
};
type ReorderAction = {
    type: "reorder";
    sourceIndex: number;
    destinationIndex: number;
    destinationZone: string;
};
type MoveAction = {
    type: "move";
    sourceIndex: number;
    sourceZone: string;
    destinationIndex: number;
    destinationZone: string;
};
type RemoveAction = {
    type: "remove";
    index: number;
    zone: string;
};
type SetUiAction = {
    type: "setUi";
    ui: Partial<UiState> | ((previous: UiState) => Partial<UiState>);
};
type SetDataAction = {
    type: "setData";
    data: Partial<Data> | ((previous: Data) => Partial<Data>);
};
type SetAction<UserData extends Data = Data> = {
    type: "set";
    state: Partial<PrivateAppState<UserData>> | ((previous: PrivateAppState<UserData>) => Partial<PrivateAppState<UserData>>);
};
type RegisterZoneAction = {
    type: "registerZone";
    zone: string;
};
type UnregisterZoneAction = {
    type: "unregisterZone";
    zone: string;
};
type PuckAction = {
    recordHistory?: boolean;
} & (ReorderAction | InsertAction | MoveAction | ReplaceAction | ReplaceRootAction | RemoveAction | DuplicateAction | SetAction | SetDataAction | SetUiAction | RegisterZoneAction | UnregisterZoneAction);

type MigrationOptions<UserConfig extends Config> = {
    migrateDynamicZonesForComponent?: {
        [ComponentName in keyof UserConfig["components"]]: (props: WithId<UserGenerics<UserConfig>["UserProps"][ComponentName]>, zones: Record<string, Content>) => ComponentData["props"];
    };
};
declare function migrate<UserConfig extends Config = Config>(data: Data, config?: UserConfig, migrationOptions?: MigrationOptions<UserConfig>): Data;

type PropTransform<Components extends DefaultComponents = DefaultComponents, RootProps extends DefaultComponentProps = DefaultRootFieldProps> = Partial<{
    [ComponentName in keyof Components]: (props: Components[ComponentName] & {
        [key: string]: any;
    }) => Components[ComponentName];
} & {
    root: (props: RootProps & {
        [key: string]: any;
    }) => RootProps;
}>;
declare function transformProps<Components extends DefaultComponents = DefaultComponents, RootProps extends DefaultComponentProps = DefaultRootFieldProps>(data: Partial<Data>, propTransforms: PropTransform<Components, RootProps>, config?: Config): Data;

declare function resolveAllData<Components extends DefaultComponents = DefaultComponents, RootProps extends Record<string, any> = DefaultRootFieldProps>(data: Partial<Data>, config: Config, metadata?: Metadata, onResolveStart?: (item: ComponentData) => void, onResolveEnd?: (item: ComponentData) => void): Promise<Data<Components, RootProps>>;

type WalkTreeOptions = {
    parentId: string;
    propName: string;
};
declare function walkTree<T extends ComponentData | RootData | G["UserData"], UserConfig extends Config = Config, G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>>(data: T, config: UserConfig, callbackFn: (data: Content, options: WalkTreeOptions) => Content | null | void): T;

export { type MappedItem as $, type AppState as A, type ArrayState as B, type Config as C, type DropZoneProps as D, type SlotComponent as E, type Fields as F, type PuckComponent as G, type History as H, type IframeConfig as I, type ComponentConfigExtensions as J, type RootConfig as K, type DefaultComponents as L, type Metadata as M, type ExtractConfigParams as N, type Overrides as O, type Permissions as P, type ConfigParams as Q, type RootDataWithProps as R, type Slot as S, type ComponentConfigParams as T, type UserGenerics as U, type Viewports as V, type WithSlotProps as W, type BaseData as X, type RootDataWithoutProps as Y, type RootData as Z, type ComponentDataOptionalId as _, type ComponentData as a, type ComponentDataMap as a0, type Content as a1, type PuckMetadata as a2, type ComponentMetadata as a3, type FieldMetadata as a4, type BaseField as a5, type TextField as a6, type NumberField as a7, type TextareaField as a8, type SelectField as a9, type RadioField as aa, type ArrayField as ab, type ObjectField as ac, type Adaptor as ad, type ExternalFieldWithAdaptor as ae, type CacheOpts as af, type ExternalField as ag, type CustomFieldRender as ah, type CustomField as ai, type SlotField as aj, type PuckContext as ak, type DefaultRootFieldProps as al, type DefaultRootRenderProps as am, type DefaultRootProps as an, type DefaultComponentProps as ao, type WithId as ap, type WithPuckProps as aq, type AsFieldProps as ar, type WithChildren as as, type ExtractField as at, type PuckAction as b, type ResolveDataTrigger as c, type Plugin as d, type UiState as e, type ComponentConfig as f, type FieldTransforms as g, type Field as h, type FieldProps as i, type Data as j, type OnAction as k, type InitialHistory as l, migrate as m, type ItemSelector as n, type Direction as o, type DragAxis as p, type Viewport as q, resolveAllData as r, type FieldTransformFnParams as s, transformProps as t, type FieldTransformFn as u, overrideKeys as v, walkTree as w, type OverrideKey as x, type FieldRenderFunctions as y, type ItemWithId as z };
