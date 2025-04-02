import styles from './FilterPanel.module.css';
import Button from "../ui/Button/Button.jsx";

const FilterPanel = ({
                         orderBy,
                         setOrderBy,
                         limit,
                         setLimit,
                         status,
                         setStatus,
                         beforeDeadline,
                         setBeforeDeadline,
                         applyFilters,
                         resetFilters
                     }) => {
    return (
        <div className={styles.panel}>
            <h3>Filters</h3>

            <label>Order by</label>
            <select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                <option value="created_at">Created at</option>
                <option value="title">Title</option>
                <option value="description">Description</option>
                <option value="status">Status</option>
                <option value="deadline">Deadline</option>
            </select>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <label>Before deadline</label>
            <input
                type="date"
                value={beforeDeadline}
                onChange={(e) => setBeforeDeadline(e.target.value)}
            />

            <label>Limit</label>
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
            </select>

            <Button onClick={applyFilters}>
                Apply filters
            </Button>

            <Button variant="outline" onClick={resetFilters}>
                Reset filters
            </Button>
        </div>
    );
};

export default FilterPanel;
