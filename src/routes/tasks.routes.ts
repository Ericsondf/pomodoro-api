import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const tasksRouter = Router();

// GET /tasks — lista todas as tasks ordenadas pela mais recente
tasksRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { startDate: 'desc' },
    });

    // Converte BigInt para number para serialização JSON
    const serialized = tasks.map((task) => ({
      ...task,
      startDate: Number(task.startDate),
      completeDate: task.completeDate !== null ? Number(task.completeDate) : null,
      interruptDate: task.interruptDate !== null ? Number(task.interruptDate) : null,
    }));

    return res.json(serialized);
  } catch (error) {
    console.error('Erro ao buscar tasks:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// POST /tasks — cria uma nova task
tasksRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { id, name, duration, type, startDate } = req.body as {
      id: string;
      name: string;
      duration: number;
      type: string;
      startDate: number;
    };

    if (!id || !name || !type) {
      return res.status(400).json({ message: 'Campos obrigatórios: id, name, type' });
    }

    if (!Number.isInteger(duration) || duration < 1) {
      return res.status(400).json({ message: 'duration deve ser um inteiro positivo' });
    }

    if (typeof startDate !== 'number' || startDate <= 0) {
      return res.status(400).json({ message: 'startDate inválido' });
    }

    const task = await prisma.task.create({
      data: { id, name, duration, type, startDate: BigInt(startDate) },
    });

    return res.status(201).json({
      ...task,
      startDate: Number(task.startDate),
      completeDate: null,
      interruptDate: null,
    });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Task com este id já existe' });
    }
    console.error('Erro ao criar task:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /tasks/:id/complete — marca task como concluída
tasksRouter.patch('/:id/complete', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body as { completeDate: number };

    if (typeof completeDate !== 'number' || completeDate <= 0) {
      return res.status(400).json({ message: 'completeDate inválido' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { completeDate: BigInt(completeDate) },
    });

    return res.json({
      ...task,
      startDate: Number(task.startDate),
      completeDate: Number(task.completeDate),
      interruptDate: task.interruptDate !== null ? Number(task.interruptDate) : null,
    });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    console.error('Erro ao completar task:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PATCH /tasks/:id/interrupt — marca task como interrompida
tasksRouter.patch('/:id/interrupt', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { interruptDate } = req.body as { interruptDate: number };

    if (typeof interruptDate !== 'number' || interruptDate <= 0) {
      return res.status(400).json({ message: 'interruptDate inválido' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: { interruptDate: BigInt(interruptDate) },
    });

    return res.json({
      ...task,
      startDate: Number(task.startDate),
      completeDate: task.completeDate !== null ? Number(task.completeDate) : null,
      interruptDate: Number(task.interruptDate),
    });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Task não encontrada' });
    }
    console.error('Erro ao interromper task:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /tasks — apaga todas as tasks (limpar histórico)
tasksRouter.delete('/', async (_req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany();
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar tasks:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});
