export const defaultConfig: any = {
        highlight: false,
        create: false,
        persist: true,
        plugins: ['dropdown_direction', 'remove_button'],
        dropdownDirection: 'down',
        onItemRemove: function () {
            let self = document.querySelector('div.selectize-dropdown.multi') as HTMLElement;
            console.log(self);
            self.style.display = 'none';
            self.style.visibility = 'hidden';
        }
    };

export const languageSelectValueConfig = Object.assign({}, defaultConfig, {
    labelField: 'label',
    valueField: 'value'
});

