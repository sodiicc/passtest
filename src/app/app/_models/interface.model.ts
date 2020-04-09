export class Interface {
    header: boolean = true;

    navControls: boolean = false; // Navigation type
    navControlsBonuses: boolean = false;
    navControlsLeft: string = null;
    navControlsRightActive: boolean = false;
    navControlsRightSize: string = "col-2";
    navControlsRight: NavigationControl = null;
    navPreviousRoute: any = null;

    title: string = 'MDM';
    navClasses: Array<string> = [];
    navStyle: String = null;

    content: ContentControl = new ContentControl();
}

export class ControlFabric {
    classes: Array<string> = [];

    classesString(): string {
        return this.classes.join(' ');
    }
}

export class NavigationControl extends ControlFabric {
    callback: () => any = () => null;
    active: boolean = true;
    content: string = null;
}

export class ContentControl extends ControlFabric{}


export class Modal {
    message: string;
    buttons: Array<ModalButtons> = [new ModalButtons()];
}

export class ModalButtons {
    text: string = "Закрыть";
    callback: (modalInstance: any) => any = (modalInstance) => modalInstance.hide();
}
