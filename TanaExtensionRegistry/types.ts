import {ITanaExtension} from "../TanaExtensionInitializer/types";
import CodeBlockElement from "../AdditionalModules/CodeBlock";

export abstract class TanaCoreExtensionRegistry {
    private static coreModules:ITanaExtension[] = [
        CodeBlockElement
    ]
    public static getExtensions():ITanaExtension[] {
        return TanaCoreExtensionRegistry.coreModules
    }


}
