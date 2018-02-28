import {Request} from 'hapi';
import {Note} from 'reperio-example-db/lib/models/note';

const routes = [
    {
        method: 'GET',
        path: '/test',
        handler: async (req: Request, h: any) => {
            return {test: 'This is a test.'};
        }
    },
    {
        method: 'GET',
        path: '/notes',
        handler: async (req: Request, h: any) => {
            try {
                const uow = await req.app.getNewUoW();
                return (await uow.testRepository.getNotes()).map((n: Note) => n.text);
            } catch(e) {
                console.log(e);
                return null;
            }
        }
    },
    {
        method: 'POST',
        path: '/add-note',
        handler: async (req: Request, h: any) => {
            const uow = await req.app.getNewUoW();
            return await uow.testRepository.addNote(req.payload.note);
        }
    }
];

export default routes;