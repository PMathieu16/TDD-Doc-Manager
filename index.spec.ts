import {
    createDocument,
    deleteAll,
    deleteById,
    Doc, downloadDocument, duplicateDocument,
    findAll,
    findByName, isNotArchived, isNotSigned, isValid, isValidName, moveDocument,
    renameDocument,
    saveDocument,
    sortDocuments,
    sendDocument
} from './index';

describe("Doc Manager",()=>{
    it("Create a new document",()=>{
      expect(createDocument("doc1","content1",new Date(),100,true,"author1",false)).toBeInstanceOf(Doc)
    })

    describe("Find all documents",()=>{
        it("should return empty array",()=>{
            let documents = []
            expect(findAll(documents)).toEqual([])
        })

        it("should return array with one element",()=>{
            let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
            let documents = [doc]

            expect(findAll(documents)).toEqual(documents)
        })
        
        it("should return array with all docs",()=>{
            let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
            let doc2 = createDocument("doc2","content2",new Date(),120,true,"author1",false)
            let documents = [doc,doc2]

            expect(findAll(documents)).toEqual(documents)
        })
    })

    it("Save document in array",()=>{
        let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
        let documents = []

        saveDocument(documents,doc)
        expect(findAll(documents)).toContain(doc)
    })

    describe("Find all documents by name",()=>{
        describe("Should return Doc",()=>{
            it("should return array with one element",()=>{
                let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
                let documents = [doc]

                expect(findByName(documents,"doc1")).toEqual([doc])
            })

            it("should return array with two element",()=>{
                let doc1 = createDocument("doc1","content1",new Date(),100,true,"author1",false)
                let doc2 = createDocument("doc2","content2",new Date(),200,true,"author2",false)
                let doc3 = createDocument("john","content2",new Date(),200,true,"author2",false)
                let documents = [doc1,doc2,doc3]

                expect(findByName(documents,"doc")).toEqual([doc1,doc2])
            })
        })

        describe("Should throw an error",()=>{
            it("Should return the given source is invalid",()=>{
                let documents = []
                expect(() => findByName(documents,"doc1")).toThrowError("The given source is invalid")
            })

            it("should return the given name is invalid",()=>{
                let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
                let documents = [doc]

                expect(() => findByName(documents,"doc2")).toThrowError("The given name is invalid")
            })
        })
    })

    describe("Delete document",()=>{
        let doc1 = createDocument("doc1","content1",new Date(),100,true,"author1",false)
        let doc2 = createDocument("doc2","content1",new Date(),100,true,"author1",false)

        it("Delete document by id",()=>{
            let documents = [doc1]
            deleteById(documents,doc1.id)

            expect(documents).toEqual([])
        })

        it("Delete all documents",()=>{
            let documents = [doc1,doc2]
            deleteAll(documents)

            expect(documents).toEqual([])
        })
    })

    describe("Sort documents",()=>{
        const doc1 = createDocument("doc1","content1",new Date(2022,11,3),800,true,"author1",false)
        const doc2 = createDocument("doc2","content2",new Date(2022,5,25),200,true,"author2",false)
        const doc3 = createDocument("doc3","content3",new Date(2022,9,1),300,true,"author3",false)

        describe("Sort documents by name",()=>{
            let documents = [doc1,doc2,doc3]

            it("in ascending order",()=>{
                expect(sortDocuments(documents,"name","asc")).toEqual([doc1,doc2,doc3])
            })

            it("in descending order",()=>{
                expect(sortDocuments(documents,"name","desc")).toEqual([doc3,doc2,doc1])
            })
        })

        describe("Sort documents by date",()=>{
            let documents = [doc1,doc2,doc3]

            it("in ascending order",()=>{
                expect(sortDocuments(documents,"date","asc")).toEqual([doc2,doc3,doc1])
            })

            it("in descending order",()=>{
                expect(sortDocuments(documents,"date","desc")).toEqual([doc1,doc3,doc2])
            })
        })

    })

    describe("Rename document",()=>{
        let doc1 = createDocument("doc1","content1",new Date(),100,false,"author1",false)
        let doc2 = createDocument("doc2","content1",new Date(),100,false,"author1",true)

        it("Should rename document",()=>{
            let documents = [doc1]

            renameDocument(documents,doc1.id,"doc2")

            expect(documents[0].name).toEqual("doc2")
        })

        it("Should throw a file name already used",()=>{
            let documents = [doc1,doc2]

            expect(() => renameDocument(documents,doc1.id,"doc2")).toThrowError("The given name is already used")
        })
    })

    describe("Duplicate document",()=>{
        let doc1 = createDocument("doc1","content1",new Date(),100,false,"author1",false)
        let doc2 = createDocument("doc2 (copy)","content1",new Date(),100,false,"author1",false)
        let doc3 = createDocument("doc3","content1",new Date(),100,true,"author1",true)
        let doc4 = createDocument("doc4","content1",new Date(),100,true,"author1",false)
        let documents = [doc1,doc2, doc3, doc4]

        it("Should return new instance of doc",()=>{
            expect(duplicateDocument(documents,doc1.id)).toBeInstanceOf(Doc)
        })

        it("Should return new instance of doc with the name copy",()=> {
            expect(duplicateDocument(documents,doc1.id).name).toEqual("doc1 (copy)")
        })

        it("Should return new instance of doc with the name copy (copy)",()=> {
            expect(duplicateDocument(documents,doc2.id).name).toEqual("doc2 (copy) (copy)")
        })
    })

    describe("Move document",()=>{
        let doc1 = createDocument("doc1","content1",new Date(),100,false,"author1",false)
        let doc2 = createDocument("doc2","content1",new Date(),100,false,"author1",false)
        let doc3 = createDocument("doc3","content1",new Date(),100,true,"author1",true)
        let documents = [doc1,doc2, doc3]
        let folder1 = []

        moveDocument(documents,doc1.id,folder1)

        it("The document should be moved in the target",()=>{
            expect(folder1).toEqual([doc1])
        })
        it("The document should be removed from the source",()=>{
            expect(documents).toEqual([doc2,doc3])
        })
    })

    describe("Download document",()=>{
      let doc1 = createDocument("doc1","content1",new Date(),100,false,"author1",false)
      let documents = [doc1]

        it("Should return the link to download document",()=>{
            expect(downloadDocument(documents,doc1.id)).toEqual("https://bonne-note.fr/download/"+doc1.id+"/doc1")
        })
    })



describe('sendDocument', () => {
    let doc1 = createDocument("doc1","content1",new Date(),100,false,"author1",false)

  it('Should send a document successfully', async () => {
    expect(sendDocument(doc1, 'recipient1')).toBe('Document sent successfully');
  });

  it('Should throw an error if the recipient is invalid', async () => {
    expect(()=>sendDocument(doc1, "")).toThrowError('Invalid recipient');
    })

  it('Should throw an error if the document title is invalid', async () => {
    let doc2 = createDocument("","content2",new Date(),100,false,"author1",false)

    expect(()=>sendDocument(doc2, "recipient2")).toThrowError('Invalid document');
    })
    
  it('Should throw an error if the document content is invalid', async () => {
    let doc2 = createDocument("title2","",new Date(),100,false,"author1",false)

    expect(()=>sendDocument(doc2, "recipient2")).toThrowError('Invalid document');
    })
});


    describe("Throw an error",()=>{
        it("Should return the given doc is invalid",()=>{
            let doc = undefined
            expect(() => isValid(doc)).toThrowError("The given doc is invalid")
        })
        it("Should throw the given name is invalid",()=>{
            let name = ""
            expect(() => isValidName(name)).toThrowError("The given name is invalid")
        })
        it("Should throw the given doc is archived",()=>{
            let doc = createDocument("doc1","content1",new Date(),100,false,"author1",true)
            expect(() => isNotArchived(doc)).toThrowError("The given doc is archived")
        })
        it("Should throw the given doc is signed",()=>{
            let doc = createDocument("doc1","content1",new Date(),100,true,"author1",false)
            expect(() => isNotSigned(doc)).toThrowError("The given doc is signed")
        })
    })
})

