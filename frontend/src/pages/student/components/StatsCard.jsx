import React from 'react'

const StatsCard = ({ title, value, icon: Icon, description, trend }) => {
    return (
        <div className="bg-bg-primary rounded-xl p-6 shadow-sm border border-border-light flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-text-secondary">{title}</p>
                    <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-action-primary/10 rounded-lg text-action-primary">
                        <Icon size={24} />
                    </div>
                )}
            </div>
            {description && (
                <p className="text-xs text-text-secondary">
                    {trend && (
                        <span className={`mr-1 font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                            {trend === 'up' ? '↑' : '↓'}
                        </span>
                    )}
                    {description}
                </p>
            )}
        </div>
    )
}

export default StatsCard
