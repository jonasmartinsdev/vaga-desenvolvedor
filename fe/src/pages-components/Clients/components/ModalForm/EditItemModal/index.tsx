import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'

import { Modal } from 'components/Modal'
import { ClientContext } from 'pages-components/Clients'
import { useContext } from 'react'

import { useForm } from 'react-hook-form'
import { api } from 'services/api'
import { IClient } from '../../../../../../@types/Client'

interface EditItemModalProps {
  isEditModalOpen: boolean
  onClose: () => void
  items: IClient
}

interface EditClientFormData {
  name: string
  cpf: string
  email: string
}

export function EditItemModal({
  isEditModalOpen,
  onClose,
  items,
}: EditItemModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<EditClientFormData>()
  const toast = useToast({ position: 'top' })
  const { dispatch } = useContext(ClientContext)

  setValue('name', items.name)
  setValue('email', items.email)
  setValue('cpf', items.cpf)

  async function handleEditProduct(data: EditClientFormData) {
    try {
      if (!data.cpf || !data.name || !data.email) {
        toast({
          status: 'error',
          title: 'Preencha os campos necessários',
          isClosable: true,
        })
        return
      }
      toast({
        status: 'loading',
        isClosable: true,
        title: 'Adicionando Item',
      })

      await api.put(`/clients/${items.id}`, data)
      toast.closeAll()

      toast({
        status: 'success',
        isClosable: true,
        title: 'Cliente Editado.',
      })

      onClose()

      dispatch({
        type: 'UPDATE-ONE-CLIENT',
        payload: { ...data, id: items.id },
      })

      reset()
    } catch (error: any) {
      console.log(error)
      toast({
        status: 'error',
        title: error.response.data.message,
        isClosable: true,
      })
    }
  }

  return (
    <Modal
      isOpen={isEditModalOpen}
      onClose={onClose}
      title="Adicionar Produto"
      size="2xl"
    >
      <FormControl
        onSubmit={handleSubmit(handleEditProduct)}
        as="form"
        display="flex"
        flexDirection="column"
        gap={4}
      >
        <FormControl isRequired>
          <FormLabel>Nome</FormLabel>
          <Input placeholder="Jonas Martins" {...register('name')} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            placeholder="email@email.com"
            {...register('email')}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>CPF</FormLabel>
          <Input placeholder="000.000.000-00" {...register('cpf')} />
        </FormControl>

        <Button
          type="submit"
          bg="blue.400"
          color="white"
          _hover={{ bg: 'blue.500' }}
          _active={{ bg: 'blue.300' }}
          isLoading={isSubmitting}
          loadingText="Adicionando"
        >
          Adicionar
        </Button>
      </FormControl>
    </Modal>
  )
}
