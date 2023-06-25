import { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

const ModalAddBook = ({ open, onClose, modalState }) => {
  // State specific to the modal
  const [modalData, setModalData] = useState('');

  const handleModalAction = () => {
    // Perform any action with the modal data
    console.log(modalData);

    // set data to empty
    setModalData('');
    
    // Close the modal
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Modal content */}
      <Box sx={style}>
        {/* Display the modal state */}
        <p>{modalState}</p>

        {/* Interact with the modal */}
        <input type="text" value={modalData} onChange={(e) => setModalData(e.target.value)} />

        {/* Trigger an action */}
        <button onClick={handleModalAction}>Action</button>
      </Box>
    </Modal>
  );
};

export default ModalAddBook;
