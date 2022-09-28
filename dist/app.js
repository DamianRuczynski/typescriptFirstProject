"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(validateInput) {
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
    return isValid;
}
//AUTOBIND DECORATOR
function autobind(target, methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
//PROJECT LIST CLASS
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.SectionToAttach = importedNode.firstElementChild;
        this.SectionToAttach.id = `${type}-projects`;
        this.ulElement = this.SectionToAttach.querySelector('.projects ul');
        this.attachContent();
        this.renderContent();
    }
    renderContent() {
        const header = this.SectionToAttach.querySelector('.projects header h2');
        const btn = document.getElementById('addBtn');
        header.textContent = `${this.type} projects`;
        header.style.textTransform = 'uppercase';
        const listId = `${this.type}-projects-list`;
        this.ulElement.id = listId;
    }
    addLi(title, desc, people) {
        const li = document.createElement('li');
        li.textContent = `Title: ${title}, Description: ${desc}, People Concerned: ${people}`;
        this.ulElement.appendChild(li);
    }
    attachContent() {
        this.hostElement.insertAdjacentElement('beforeend', this.SectionToAttach);
    }
}
//PROJECT INPUT CLASS
class ProjectInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.templateElement = document.getElementById('project-input');
        this.titleInputElement = this.element.querySelector('#title');
        this.descInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.projectInputBtn = this.element.querySelector('form button');
        this.attachContent();
        this.configure();
    }
    attachContent() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    configure() {
        this.projectInputBtn.addEventListener('click', this.submitHandler);
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDesc = this.descInputElement.value;
        const enteredPeopleNumber = this.peopleInputElement.value;
        const validateTitle = {
            value: enteredTitle,
            required: true,
        };
        const validateDesc = {
            value: enteredDesc,
            required: true,
            minLength: 5
        };
        const validatePeople = {
            value: +enteredPeopleNumber,
            required: true,
            min: 1,
            max: 7,
        };
        if (validate(validateTitle) &&
            validate(validateDesc) &&
            validate(validatePeople)) {
            activeProjectList.addLi(enteredTitle, enteredDesc, +enteredPeopleNumber);
            return [enteredTitle, enteredDesc, +enteredPeopleNumber];
        }
        else {
            alert('Invalid Values!');
            return;
        }
        ;
    }
    clearInput() {
        this.titleInputElement.value = '';
        this.descInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInput();
        }
    }
    fillInputs(event) {
        event.preventDefault();
        this.titleInputElement.value = 'My Title';
        this.descInputElement.value = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis distinctio, consectetur aspernatur unde quidem nisi quisquam necessitatibus! Accusamus ut, ipsa amet officia, beatae quisquam non dolorem voluptatibus atque, eaque porro.';
        this.peopleInputElement.value = '9';
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const newProj = new ProjectInput;
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
