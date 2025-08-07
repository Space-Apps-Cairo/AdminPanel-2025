
import FormBuilder from '@/components/FormBuilder/FormBuilder';

const Index = () => {
    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent mb-4">
                        Dynamic Form Builder
                    </h1>
                    <p className="text-xl text-gray-600">
                        Create, customize, and deploy Nasa Space forms with dependent fields and templates
                    </p>
                </div>
                <FormBuilder />
            </div>
        </div>
    );
};

export default Index;
