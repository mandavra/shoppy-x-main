export default function getStatusDate(order) {
    const matchedStatusDate = order.orderStatusTimeline.find(
        s => s.title.toLowerCase().includes(order.orderStatus.toLowerCase()) && s.date
    )
    return matchedStatusDate ? new Date(matchedStatusDate.date).toLocaleString() : "-"

}