import {ITanaExtension} from "../TanaExtensionInitializer/types";

export default new class TanaExtensionRegistry  {
    private  additionalExtensions:ITanaExtension[] = []

     getExtensions(): ITanaExtension[] {
        return [
            ...this.additionalExtensions
        ]
    }

}