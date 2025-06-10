import '../styles/CustomModal.css';
import PropTypes from 'prop-types';

const Modal = ({ visible, onClose, children }) => {
  if (!visible) return null;
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <button
          className="custom-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default Modal;
