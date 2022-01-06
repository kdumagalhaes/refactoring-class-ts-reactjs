import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood/';
import { FoodsContainer } from './styles';
import { useState } from 'react/cjs/react.development';
import { useEffect } from 'react';

const Dashboard = () => {

    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [foods, setFoods] = useState([])
    const [editingFood, setEditingFood] = useState({})

    useEffect(() => {
        const fetchFood = async () => {
            const response = await api.get('/foods')
            setFoods(response.data)
        }
        fetchFood()
    }, [])

    const toggleModal = () => {
        setModalOpen(!modalOpen)
    }

    const toggleEditModal = () => {
        setEditModalOpen(!editModalOpen)
    }

    const handleAddFood = async (food) => {
        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });
            setFoods([...foods, response.data])

        } catch (error) {
            console.error(error)
        }
    }

    const handleEditFood = (food) => {
        setEditingFood(food)
        setEditModalOpen(true)
    }

    const handleUpdateFood = async (food) => {
        try {
            const foodUpdated = await api.put(`/foods/${editingFood.id}`,
                { ...editingFood, ...food })

            const foodsUpdated = foods.map(f => {
                return f.id !== foodUpdated.data.id ? f : foodUpdated.data
            })

            setFoods(foodsUpdated)

        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteFood = async (id) => {
        await api.delete(`/foods/${id}`)
        const foodsFiltered = foods.filter(food => food.id !== id);
        setFoods(foodsFiltered)
    }

    return (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={modalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            />
            <ModalEditFood
                isOpen={editModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />

            <FoodsContainer data-testid="foods-list">
                {foods &&
                    foods.map(food => (
                        <Food
                            key={food.id}
                            food={food}
                            handleDelete={handleDeleteFood}
                            handleEditFood={handleEditFood}
                        />
                    ))}
            </FoodsContainer>
        </>
    )
}

export default Dashboard