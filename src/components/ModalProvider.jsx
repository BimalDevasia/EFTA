"use client";

import { useModal } from "@/stores/useModal";
import { Dialog, DialogContent } from "./ui/dialog";
import AddressModal from "./modals/AddressModal";

const ModalProvider = () => {
  const { modal, closeModal } = useModal();
  return (
    <>
      <Dialog open={modal !== null} onOpenChange={closeModal}>
        <DialogContent className="bg-white">
          {modal === "address" && <AddressModal />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalProvider;
