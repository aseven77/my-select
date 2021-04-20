const getTemplate = (data = [], placeholder, selectedId) => {
    let textPlaceholder = placeholder ?? 'Выберите значение';
    
    const items = data.map(item => {
        let cls = '';

        if(item.id === selectedId) {
            textPlaceholder = item.value;
            cls = 'my-select__item--active'
        }
       return  `<li class='my-select__item ${cls}' data-type='item' data-id='${item.id}'>${item.value}</li>`
    });

    
    return `
        <div class='my-select'>
            <div class='my-select__backdrop' data-type='backdrop'></div>
            <div class='my-select__control' data-type='input'>
                <span data-type='value'>${textPlaceholder}</span>
            </div>
            <div class='my-select__dropdown'>
                <ul class='my-select__list'>
                   ${items.join('')}
                </ul>
            </div>
        </div>
    `
}


export class Select {

    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.isOption = options.isOption ?? true;
        this.selectedId = options.selectedId;
        this.optionsList = [];

        this.#render();
        this.#setup()
    }

    #render() {
        const {placeholder} = this.options;
        const {data} = this.options;
        const selectOptions = this.$el.options;
                
        if(this.isOption) {
            for(var i = 0; i < selectOptions.length; i++) {
                this.optionsList[i] = {id: i , value: selectOptions.item(i).text}
            }
        }

        if(data) {
            var counter = this.optionsList.length;
            for(var i = 0; i < data.length; i++) {
                this.optionsList[counter] = {id: counter, value: data[i]};
                
                counter++
            }
        }
        
        this.$el.insertAdjacentHTML('afterend', getTemplate(this.optionsList , placeholder, this.selectedId));        
    }

    #setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$select = this.$el.nextElementSibling;     
        this.$item =  this.$select.querySelectorAll('[data-type="item"]');
        this.$value =  this.$select.querySelector('[data-type="value"]');
        this.$select.addEventListener('click', this.clickHandler);
        this.$el.setAttribute('style' ,"display: none" )

    }

    get isOpen() {
        return this.$select.classList.contains('my-select--open')
    }

    get current() {
        return this.optionsList
    }


    clickHandler(event) {
        const {type} = event.target.dataset;
 
        if(type === 'input') {
            this.toogle()
        }
        
        else if (type === 'item') {
            const id = event.target.dataset.id
            this.select(id)
        }

        else if (type === 'backdrop') {
            this.close()
        }
        
    }


    select(id) {
        this.selectedId = id;
        this.$value.textContent = this.current[id].value;

        this.$select.querySelectorAll(`[data-type='item']`).forEach(element => {
            element.classList.remove('my-select__item--active')
        });
        this.$select.querySelector(`[data-id='${id}']`).classList.add('my-select__item--active');
        this.close();
    }
    

    toogle() {
        this.isOpen ? this.close() : this.open()
    }

    open() {
        this.$select.classList.add('my-select--open')
    }

    close() {
        this.$select.classList.remove('my-select--open')
    }

    destroy() {
        this.$select.removeEventListener('click', this.clickHandler);
        this.$el.removeAttribute('style')
        this.$select.remove()
    }
}