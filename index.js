import { Select } from './select/select';
import './select/index';

const select = new Select('#select', {
    placeholder: "Выберите дату",
    selectedId: 5,
    data: ["Выбор 1", "Выбор 2", "Выбор 3"]
});

window.s = select;