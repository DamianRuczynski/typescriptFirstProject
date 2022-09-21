class ProjectInput {
    templateElement: HTMLTemplateElement
    hostElement: HTMLDivElement
    formToAttach: HTMLFormElement

    constructor() {
        this.templateElement = <HTMLTemplateElement>document.getElementById('project-input')!
        this.hostElement = <HTMLDivElement>document.getElementById('app')!

        const importedNode = document.importNode(this.templateElement.content, true)
        this.formToAttach = <HTMLFormElement>importedNode.firstElementChild
        this.attachContent()
    }

    private attachContent() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formToAttach)
    }

}

const newProj = new ProjectInput


