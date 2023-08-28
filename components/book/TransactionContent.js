
export default function TransactionContent({bookData, contentType, setContentFunct}) {
    // content for transaction page
    return (
        <div>
            <h1>Transaction of {bookData.name}</h1>
            <img src={bookData.logoUrl} alt="Book Logo" width={50} height={50} />
        </div>
    );
}