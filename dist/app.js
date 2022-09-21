"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formToAttach = importedNode.firstElementChild;
        this.attachContent();
    }
    attachContent() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formToAttach);
    }
}
const newProj = new ProjectInput;
