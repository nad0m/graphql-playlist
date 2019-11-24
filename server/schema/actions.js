const getCollection = async (collection) => {
    const snapshot = await collection.get();
    return snapshot.docs.map(doc => doc.data());
}

const addDoc = async (collection, args) => {

    const docRef = await collection.add({
        ...args
    });

    const doc = await docRef.get();

    return doc ? doc.data() : null;
}

const getDoc = async (collection, id) => {
    const docRef = collection.doc(id);

    const doc = await docRef.get();

    return doc ? doc.data() : null;
}

module.exports = {
    getDoc,
    addDoc,
    getCollection
}