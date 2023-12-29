
import {Modal, Button, ModalContent, ModalBody, ModalFooter, ModalHeader} from '@nextui-org/react';

const RemoveGroupModal = ({isOpen, onOpenChange ,handleDeleteConfirm}) => {
    return (<Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"} backdrop={"blur"}>
            <ModalContent>
                {(onClose) => (<>
                <ModalHeader>Delete Group</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this group?
                </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" onPress={handleDeleteConfirm}>
                            Delete
                        </Button>
                    </ModalFooter>
                </>)}
            </ModalContent>
        </Modal>);
};

export default RemoveGroupModal;
