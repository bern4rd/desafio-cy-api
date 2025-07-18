export default {
    createValidTicket: () => ({
        description: `Ticket created at ${new Date().toISOString()}`
    }),
    updateStatus: (status) => ({
        status: status
    })
};