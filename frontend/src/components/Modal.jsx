export default function Modal({ title, description, onConfirm, onCancel, danger = false, confirmText = 'Confirm' }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <h2 className="modal-title" id="modal-title">{title}</h2>
        {description && <p className="modal-desc">{description}</p>}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} id="modal-cancel-btn">
            Cancel
          </button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            id="modal-confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
