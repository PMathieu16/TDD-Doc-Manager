export class Doc {
    private readonly _id: number;
    private _name: string;
    private _content: string;
    private _date: Date;
    private _size: number;
    private _signed: boolean;
    private _author: string;
    private _archived: boolean;

    constructor(name: string, content: string, date: Date, size: number, signed: boolean, author: string, archived: boolean) {
        this._id = Math.floor(Math.random() * 1000);
        this._name = name;
        this._content = content;
        this._date = date;
        this._size = size;
        this._signed = signed;
        this._author = author;
        this._archived = archived;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get size(): number {
        return this._size;
    }

    set size(value: number) {
        this._size = value;
    }

    get signed(): boolean {
        return this._signed;
    }

    set signed(value: boolean) {
        this._signed = value;
    }

    get author(): string {
        return this._author;
    }

    set author(value: string) {
        this._author = value;
    }

    get archived(): boolean {
        return this._archived;
    }

    set archived(value: boolean) {
        this._archived = value;
    }

    get id(): number {
        return this._id;
    }
}

export const createDocument = (name: string, content: string, date: Date, size: number, signature: boolean, author: string, archived: boolean): Doc => {
    return new Doc(name, content, date, size, signature, author, archived)
}

export const saveDocument = (source: Array<Doc>, doc: Doc) : void => {
    source.push(doc)
}

export const findAll = (source: Array<Doc>) : Array<Doc> => {
    return source
}

export const findByName = (source: Array<Doc>, name: string) : Array<Doc> => {
    if(source.length === 0) throw new Error("The given source is invalid")

    let doc = source.filter(doc => doc.name.includes(name))

    if(doc.length === 0) throw new Error("The given name is invalid")

    return doc
}

export const deleteById = (source: Array<Doc>, id: number) : void => {
    let index = source.findIndex(doc => doc.id === id)
    source.splice(index, 1)
}

export const sortDocuments = (source: Array<Doc>, element: 'name' | 'date' | 'size' | 'author', order: 'asc' | 'desc') : Array<Doc> => {
    const comparator = (a, b) => {
        const compA = element === 'date' ? new Date(a[element]) : a[element]
        const compB = element === 'date' ? new Date(b[element]) : b[element]
        return compA < compB ? -1 : (compA > compB ? 1 : 0);
    }
    return order === 'asc' ? source.sort(comparator) : source.sort(comparator).reverse();
}

export const deleteAll = (source: Array<Doc>) : void => {
    source.splice(0, source.length)
}

export const renameDocument = (source: Array<Doc>, id: number, name: string) : Doc => {
    let doc = source.find(doc => doc.id === id)

    if(source.find(doc => doc.name === name)) throw new Error("The given name is already used")

    if(isValid(doc) && isValidName(name) && isNotArchived(doc) && isNotSigned(doc)) {
        doc.name = name;
        return doc;
    }
}

export const duplicateDocument = (source: Array<Doc>, id: number) : Doc => {
    let doc = source.find(doc => doc.id === id)

    if(isValid(doc) && isNotArchived(doc) && isNotSigned(doc)) {
        let duplicateDoc: Doc = createDocument(doc.name +" (copy)", doc.content, doc.date, doc.size, doc.signed, doc.author, doc.archived)
        saveDocument(source, duplicateDoc)
        return duplicateDoc
    }
}

export const moveDocument = (source: Array<Doc>, id: number, target: Array<Doc>) : Array<Doc> => {
    let doc = source.find(doc => doc.id === id)

    if(isValid(doc)){
        saveDocument(target, doc)
        deleteById(source, id)
        return target
    }
}

export const downloadDocument = (source: Array<Doc>, id: number) : string => {
    let doc = source.find(doc => doc.id === id)

    if(isValid(doc)) return "https://bonne-note.fr/download/"+doc.id+"/"+doc.name
}

export const isValid = (doc: Doc) : boolean => {
    if(!doc) throw new Error("The given doc is invalid")
    return true
}

export const isValidName = (name: string) : boolean => {
    if(name === "") throw new Error("The given name is invalid")
    return true
}

export const isNotArchived = (doc: Doc) : boolean => {
    if(doc.archived) throw new Error("The given doc is archived")
    return true
}

export const isNotSigned = (doc: Doc) : boolean => {
    if(doc.signed) throw new Error("The given doc is signed")
    return true
}