
export default function OverviewContent({bookData, contentType, setContentFunct}) {
    // this is to make overview page
    return (
        <div>
            <h1>OverviewBook Name: {bookData.name}</h1>
            <p>Book Id: {bookData.id}</p>
        </div>
    );
}