export class Modal {
    message: string;
    buttons: Array<ModalButtons> = [new ModalButtons()];
}

export class ModalButtons {
    text: string = "Закрыть";
    callback: (modalInstance: any) => any = (modalInstance) => modalInstance.hide();
}
