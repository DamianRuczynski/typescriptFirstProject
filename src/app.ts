//VALIDATION
interface Validatable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(validateInput: Validatable) {
    let isValid = true;
    if (validateInput.required) {
        isValid = isValid && validateInput.value.toString().trim().length !== 0;
    }

    if (validateInput.minLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length > validateInput.minLength;
    }
    if (validateInput.maxLength != null && typeof validateInput.value === 'string') {
        isValid = isValid && validateInput.value.length < validateInput.maxLength;
    }
    if (validateInput.min != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value > validateInput.min;
    }
    if (validateInput.max != null && typeof validateInput.value === 'number') {
        isValid = isValid && validateInput.value < validateInput.max;
    }

    return isValid

}

//AUTOBIND DECORATOR
function autobind(
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    };
    return adjDescriptor;
}

//PROJECT LIST CLASS

class ProjectList {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    SectionToAttach: HTMLElement
    ulElement: HTMLUListElement

    constructor(private type: 'active' | 'finished') {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-list')!;
        this.hostElement = <HTMLDivElement>document.getElementById('app')!;

        const importedNode = document.importNode(this.templateElement.content, true);
        this.SectionToAttach = <HTMLElement>importedNode.firstElementChild;
        this.SectionToAttach.id = `${type}-projects`;
        this.ulElement = <HTMLUListElement>this.SectionToAttach.querySelector('.projects ul');
        this.attachContent();
        this.renderContent();
    }


    renderContent() {
        const header = <HTMLParagraphElement>this.SectionToAttach.querySelector('.projects header h2')!;
        const btn = <HTMLButtonElement>document.getElementById('addBtn')
        header.textContent = `${this.type} projects`;
        header.style.textTransform = 'uppercase';
        const listId = `${this.type}-projects-list`;
        this.ulElement.id = listId;

    }

    addLi(title: string, desc: string, people: number) {
        const li = document.createElement('li');
        li.textContent = `Title: ${title}, Description: ${desc}, People Concerned: ${people}`;
        this.ulElement.appendChild(li);
    }

    private attachContent() {
        this.hostElement.insertAdjacentElement('beforeend', this.SectionToAttach)
    }
}


//PROJECT INPUT CLASS
class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    formToAttach: HTMLFormElement
    titleInputElement: HTMLInputElement
    descInputElement: HTMLTextAreaElement
    peopleInputElement: HTMLInputElement
    projectInputBtn: HTMLButtonElement

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!
        this.hostElement = <HTMLDivElement>document.getElementById('app')!

        const importedNode = document.importNode(this.templateElement.content, true)
        this.formToAttach = <HTMLFormElement>importedNode.firstElementChild
        this.formToAttach.id = 'user-input'

        this.titleInputElement = <HTMLInputElement>this.formToAttach.querySelector('#title')
        this.descInputElement = <HTMLTextAreaElement>this.formToAttach.querySelector('#description')
        this.peopleInputElement = <HTMLInputElement>this.formToAttach.querySelector('#people')
        this.projectInputBtn = <HTMLButtonElement>this.formToAttach.querySelector('form button')

        this.attachContent()
        this.configure()
    }

    private attachContent() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formToAttach)
    }

    private configure() {
        this.projectInputBtn.addEventListener('click', this.submitHandler)
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descInputElement.value;
        const enteredPeopleNumber = this.peopleInputElement.value;

        const validateTitle: Validatable = {
            value: enteredTitle,
            required: true,
        };

        const validateDesc: Validatable = {
            value: enteredDesc,
            required: true,
            minLength: 5
        };

        const validatePeople: Validatable = {
            value: +enteredPeopleNumber,
            required: true,
            min: 1,
            max: 7,
        };

        if (
            validate(validateTitle) &&
            validate(validateDesc) &&
            validate(validatePeople)
        ) {
            activeProjectList.addLi(enteredTitle, enteredDesc, +enteredPeopleNumber)
            return [enteredTitle, enteredDesc, +enteredPeopleNumber]
        } else {
            alert('Invalid Values!')
            return
        };
    }

    private clearInput() {
        this.titleInputElement.value = '';
        this.descInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();

        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInput()
        }
    }

    private fillInputs(event: Event) {
        event.preventDefault();
        this.titleInputElement.value = 'My Title'
        this.descInputElement.value = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis distinctio, consectetur aspernatur unde quidem nisi quisquam necessitatibus! Accusamus ut, ipsa amet officia, beatae quisquam non dolorem voluptatibus atque, eaque porro.'
        this.peopleInputElement.value = '9'
    }

}


const newProj = new ProjectInput
const activeProjectList = new ProjectList('active')
const finishedProjectList = new ProjectList('finished')


