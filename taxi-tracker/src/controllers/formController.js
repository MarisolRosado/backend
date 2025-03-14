class FormController {
    constructor(firebase) {
        this.db = firebase.firestore();
    }

    async handleFormSubmission(req, res) {
        const formData = req.body;

        try {
            await this.db.collection('formSubmissions').add(formData);
            res.status(200).send({ message: 'Form submitted successfully!' });
        } catch (error) {
            console.error('Error submitting form:', error);
            res.status(500).send({ message: 'Error submitting form.' });
        }
    }
}

export default FormController;