"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddStudentModal() {
  const [isOpen, setOpen] = useState(true);
  const handleClose = () => {
    // Close the modal
    setOpen(!isOpen);
  };

  const handleAnimationComplete = () => {
    // Animation is complete, trigger page navigation
    router.back();
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
              Modal Title
            </ModalHeader>
            <ModalBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                pulvinar risus non risus hendrerit venenatis. Pellentesque sit
                amet hendrerit risus, sed porttitor quam.
              </p>
              <p>
                Magna exercitation reprehenderit magna aute tempor cupidatat
                consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
                consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
                et. Culpa deserunt nostrud ad veniam.
              </p>
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
