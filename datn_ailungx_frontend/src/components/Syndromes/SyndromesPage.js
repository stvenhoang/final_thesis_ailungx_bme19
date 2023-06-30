import "./SyndromesPage.css"
const SyndromesPage = () => {
    const syndromeList = [
        { "id": 1 ,"name": "Atelectasis", "description": "Atelectasis is a condition characterized by the partial or complete collapse of a lung or a section of the lung. It is often caused by blockages in the airways or by pressure on the lung."},
        { "id": 2 ,"name": "Cardiomegaly", "description": "Cardiomegaly refers to an enlarged heart. This condition is usually a sign of an underlying heart condition or an increase in the workload of the heart. Enlargement of the heart specifically affecting the lungs. It can be caused by conditions such as high blood pressure, heart disease, or lung disorders."},
        { "id": 3 ,"name": "Effusion", "description": "Effusion refers to the accumulation of fluid in a body cavity, such as the pleural cavity around the lungs or the joint spaces. It can be caused by various factors, including inflammation, infection, or trauma."},
        { "id": 4 ,"name": "Infiltration", "description": "Infiltration refers to the abnormal presence of substances, such as fluid, cells, or foreign materials, within the tissues. In the context of chest radiography, pulmonary infiltrates are often indicative of lung diseases or infections."},
        { "id": 5 ,"name": "Mass", "description": "A mass refers to an abnormal growth or tumor in the body. In the context of chest radiography, a lung mass can indicate the presence of a benign or malignant tumor."},
        { "id": 6 ,"name": "Nodule", "description": "A nodule is a small, rounded lesion or growth in the lung. Lung nodules can be caused by various factors, including infections, inflammation, or tumors. They are often detected during imaging studies and may require further evaluation."},
        { "id": 7 ,"name": "Pneumonia", "description": "Pneumonia is an infection that causes inflammation in the air sacs of the lungs. It is typically caused by bacteria, viruses, or fungi and can lead to symptoms such as cough, fever, and difficulty breathing."},
        { "id": 8 ,"name": "Pneumothorax", "description": "Pneumothorax refers to the presence of air or gas in the pleural cavity, which can cause the lung to collapse partially or completely. It can occur spontaneously or as a result of trauma or certain medical procedures."},
        { "id": 9 ,"name": "Consolidation", "description": "Consolidation refers to the solidification or compression of lung tissue, usually due to the accumulation of fluid, pus, or inflammatory cells. It is often associated with pneumonia or other respiratory infections."},
        { "id": 10 ,"name": "Edema", "description": "Edema is the abnormal accumulation of fluid in the body's tissues. Pulmonary edema specifically refers to the buildup of fluid in the lungs, which can result from heart failure, kidney problems, or other conditions."},
        { "id": 11 ,"name": "Emphysema", "description": "Emphysema is a chronic lung condition characterized by the destruction of the air sacs in the lungs, leading to difficulties in breathing. It is often caused by long-term exposure to irritants, such as cigarette smoke."},
        { "id": 12 ,"name": "Fibrosis", "description": "Fibrosis refers to the formation of excess fibrous connective tissue in an organ, which can result in the loss of normal tissue function. Pulmonary fibrosis specifically affects the lungs and can be caused by various factors, including exposure to certain toxins or underlying medical conditions."},
        { "id": 13 ,"name": "Pleural Thickening", "description": "Pleural thickening refers to the thickening of the membranes (pleura) that line the lungs and the inner chest wall. It can be caused by various factors, such as inflammation, infection, or exposure to asbestos."},
        { "id": 14 ,"name": "Hernia", "description": "A hernia refers to the protrusion of an organ or tissue through an abnormal opening in the surrounding muscles or connective tissue. In the context of chest radiography, a diaphragmatic hernia involves the displacement of abdominal organs into the chest cavity."},
    ]

    return (
        <section className="syndrome-container">
            <div className="syndrome-label">Syndromes Detail</div>
            <div className="syndrome-label2">Our application supports the diagnosis and analysis of 14 syndromes. The data for these syndromes is obtained from the NIH Chest-Xray dataset and trained with our model to enable the diagnosis of these syndromes. You can find detailed information about the 14 syndromes listed below:</div>
            <div className="syndrome-container1">
                    {syndromeList.map((syndrome) => {
                        return (
                            <div className="syndrome-container2" key={syndrome.id}>
                                <div className="syndrome-text-label">{syndrome.name}</div>
                                <div className="syndrome-text">{syndrome.description}</div>
                            </div>
                        )
                    })}            
            </div>
            
            


        </section>
    );
}
 
export default SyndromesPage;