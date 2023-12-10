"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";

export default function AddStudentModal(props) {
  const [isOpen, setOpen] = useState(true);
  const handleClose = () => {
    // Close the modal
    setOpen(!isOpen);
  };

  const handleAnimationComplete = async () => {
    // Animation is complete, trigger page navigation
    await router.back();
  };
  const router = useRouter();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size='5xl'
        placement='center'
        onOpenChange={(open) => {
          open === false && handleAnimationComplete();
        }}
      >
        <ModalContent>
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {props.title}
            </ModalHeader>
            <ModalBody>{props.children}</ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
