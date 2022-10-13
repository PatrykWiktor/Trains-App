import React, { Children, useState } from "react";
import { Button, Modal } from "react-bootstrap";
function Dialog({
  child,
  btn,
  btnText,
  btnVariant,
  dialogHeading,
  dialogBody,
  onShow,
  onConfirm,
  onConfirmVar,
  onCancel,
  onCancelVar,
  canShow,
  cantShow,
}) {
  //modal
  if (canShow == undefined) canShow = true;
  const [show, setShow] = useState(false);
  
  const handleClose = () => {
    setShow(false);
    if (onCancel) {
      onCancel();
    }
  };
  const handleConfirm = () => {
    setShow(false);
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleShow = () => {
    if (onShow) {
      onShow();
    }
    setShow(true);
  };
  //
  
  return (
    <div>
      {btn == true ? (
        <Button
          variant={btnVariant ? btnVariant : "primary"}
          onClick={() => {
            if (canShow) handleShow();
            else cantShow();
          }}
        >
          {btnText}
        </Button>
      ) : (
        <div onClick={() => {
          if (canShow) handleShow();
          else cantShow();
        }}> {child}</div>
      )}

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{dialogHeading && dialogHeading}</Modal.Title>
        </Modal.Header>
        {dialogBody && <Modal.Body>{dialogBody}</Modal.Body>}
        <Modal.Footer>
          <Button
            variant={onCancelVar ? onCancelVar : "secondary"}
            onClick={handleClose}
          >
            Close
          </Button>
          {onConfirm && (
            <Button
              variant={onConfirmVar ? onConfirmVar : "primary"}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Dialog;
